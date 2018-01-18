'use strict';

const
    fs = require('fs'),
    defaults = {
        file: ".env",
        encoding: "utf8",
    };

module.exports = {setSettings, readEnvFile, setProcessEnv};

/**
 * Create settings object with default values
 * and custom options which has precedence.
 *
 * @param {Object} options
 * @returns {Object} settings
 */
function setSettings (options) {
    return {...defaults, ...options};
}

/**
 * Read env file and return array of rows.
 *
 * @param {Object} settings
 * @returns {Array} env rows
 */
function readEnvFile (settings) {
    return fs.readFileSync(settings.file, {encoding: settings.encoding}).split('\n');
}

/**
 * Add environment variables to global process.env array.
 * Regular expression is used to match KEY=VALUE pattern.
 *
 * @param {String} row
 */
function setProcessEnv (row) {
    if (row) {
        let
            env = row.match(/^([\w\-. ]+) ?=(.*)$/i),
            env_key = env[1].toUpperCase().trim().replace(' ', '_'),
            env_value = env[2].trim();

        process.env[env_key] = env_value;
    }
}
