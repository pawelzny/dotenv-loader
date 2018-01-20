'use strict';

const
    fs = require('fs'),
    defaults = {
        file: ".env",
        encoding: "utf8",
    };

module.exports = {setSettings, readEnvFile, setProcessEnv};

class EnvironmentKeyError extends Error {
    constructor(message) {
        super();

        this.name = "EnvironmentKeyError";
        this.message = message || "Environment variable KEY is not defined";
    }
}

/**
 * Create settings object with default values
 * and custom options which has precedence.
 *
 * @param {Object} options
 * @returns {Object} settings
 */
function setSettings(options=null) {
    if (options === null) {
        options = {};
    }
    return {...defaults, ...options};
}

/**
 * Read env file and return array of rows.
 *
 * @param {Object} settings
 * @returns {Array} env rows
 */
function readEnvFile(settings) {
    return fs.readFileSync(settings.file, {encoding: settings.encoding}).split('\n');
}

/**
 * Add environment variables to global process.env array.
 * Regular expression is used to match KEY=VALUE pattern.
 *
 * @param {String} row
 */
function setProcessEnv(row) {
    if (row) {
        let env = row.match(/^([\w\s\-.]+)=(.*)$/i);
        if (! env) {
            throw new EnvironmentKeyError(`Environment KEY=VALUE pair for '${row}' is corrupted.`);
        }

        let key = env[1].trim(),
            value = env[2].trim();

        process.env[key] = value;
    }
}
