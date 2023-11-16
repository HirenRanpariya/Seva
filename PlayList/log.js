const fs = require("fs");
const path = require("path");

function log(message) {
    const logFilePath = path.join(__dirname, "logs.txt");

    // Check if the log file is available
    if (!fs.existsSync(logFilePath)) {
        console.log(`Log file not found. Creating ${logFilePath}`);
        // Create the log file if it doesn't exist
        fs.writeFileSync(logFilePath, "");
    }

    // Get the current timestamp
    const timestamp = new Date().toLocaleString();

    // Get the calling line number
    const lineNumber = new Error().stack.split("\n")[2].split(":")[1];

    // Format the log entry
    const logEntry = `[${timestamp}] [Line ${lineNumber}] ${message}\n`;

    // Append the log entry to the file
    fs.appendFile(logFilePath, logEntry, (err) => {
        if (err) {
            console.error(`Error writing to log file: ${err}`);
        } else {
            console.log(`Message logged to ${logFilePath}`);
        }
    });
}

module.exports = {
    log,
};
