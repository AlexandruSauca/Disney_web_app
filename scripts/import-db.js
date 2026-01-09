const Database = require('better-sqlite3');
const fs = require('fs');
const readline = require('readline');
const path = require('path');

const DB_PATH = path.join(process.cwd(), 'disney.db');
const SQL_PATH = path.join(process.cwd(), 'disney_characters.sql');

console.log(`Setting up database at ${DB_PATH}...`);
const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

async function importSql() {
    if (!fs.existsSync(SQL_PATH)) {
        console.error('SQL dump file not found!');
        process.exit(1);
    }

    const fileStream = fs.createReadStream(SQL_PATH);
    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity,
    });

    const insertBuffer = [];
    const BATCH_SIZE = 1000;

    // Transaction wrapper for batch inserts
    const runBatch = db.transaction((lines) => {
        for (const line of lines) {
            try {
                db.exec(line);
            } catch (err) {
                // Ignore specific MySQL-specific errors if safe, or log
                // console.warn('Skipped line:', line.substring(0, 50), err.message);
            }
        }
    });

    console.log('Reading SQL file...');

    let lineCount = 0;
    let processingTable = false;

    for await (const line of rl) {
        lineCount++;
        let sql = line.trim();

        if (!sql || sql.startsWith('--') || sql.startsWith('/*')) continue;

        // Fix MySQL syntax nuances

        // 1. Table Creation
        if (sql.includes('CREATE TABLE')) {
            // Replace MySQL types with SQLite compatible ones if strictly needed, 
            // though SQLite is flexible. 
            // Major one: INT UNSIGNED PRIMARY KEY AUTO_INCREMENT -> INTEGER PRIMARY KEY AUTOINCREMENT
            sql = sql.replace(/INT UNSIGNED PRIMARY KEY AUTO_INCREMENT/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT');
            sql = sql.replace(/JSON/gi, 'TEXT'); // SQLite doesn't have native JSON type name, stores as TEXT
            sql = sql.replace(/CHARACTER SET [a-z0-9_]+/gi, '');
            sql = sql.replace(/COLLATE [a-z0-9_]+/gi, '');
            sql = sql.replace(/ENGINE=[a-zA-Z0-9_]+/gi, '');
            sql = sql.replace(/DEFAULT CHARSET=[a-zA-Z0-9_]+/gi, '');
            processingTable = true;
        }

        if (processingTable && sql.endsWith(';')) {
            processingTable = false;
        }

        // 2. Inserts
        // MySQL dumps often use multiple values per INSERT: INSERT INTO x VALUES (1), (2), (3)...
        // SQLite supports this too.

        // Attempt to handle MySQL escaping if it interferes (e.g. \' -> '')
        // standard dumps usually work ok.

        if (sql.startsWith('INSERT INTO')) {
            // Extract values from: INSERT INTO `data` VALUES (1,'{json}'),(2,'{json}');
            // Regex to match: (\d+),\s*'((?:[^'\\]|\\.|'')*)'
            // MySQL dump escapes ' as \', but we replaced \' with '' earlier? No, let's reset.

            // We need to parse strictly.
            const matches = sql.matchAll(/\((\d+),\s*'((?:[^'\\]|\\.|'')*)'\)/g);
            for (const match of matches) {
                const id = match[1];
                let jsonStr = match[2];

                // Unescape MySQL string to get the raw JSON string
                // MySQL escapes: \', \", \\, \n, \r, etc.
                // We mainly care about \' becoming ' and \\ becoming \
                jsonStr = jsonStr.replace(/\\'/g, "'");
                jsonStr = jsonStr.replace(/\\"/g, '"');
                jsonStr = jsonStr.replace(/\\\\/g, "\\");

                insertBuffer.push(`INSERT INTO data (id, data) VALUES (${id}, '${jsonStr.replace(/'/g, "''")}')`);
            }
        } else if (sql.includes('CREATE TABLE') || sql.includes('DROP TABLE')) {
            // Run schema changes immediately
            try {
                db.exec(sql);
            } catch (e) {
                console.log("Schema error:", e.message);
            }
        }

        if (insertBuffer.length >= BATCH_SIZE) {
            process.stdout.write(`\rProcessed ${lineCount} lines...`);
            runBatch(insertBuffer);
            insertBuffer.length = 0;
        }
    }

    // Final batch
    if (insertBuffer.length > 0) {
        runBatch(insertBuffer);
    }

    console.log('\nImport completed!');

    // Verify
    try {
        const count = db.prepare("SELECT count(*) as c FROM data").get();
        console.log(`Total records in 'data' table: ${count.c}`);
    } catch (e) {
        console.log("Could not verify data count:", e.message);
    }
}

importSql().catch(console.error);
