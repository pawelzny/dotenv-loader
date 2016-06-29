'use strict';

const
    fs = require('fs'),
    defaults = {
        file: ".env",
        encoding: "utf8"
    };

module.exports = {setSettings, readEnvFile, setProcessEnv};

/**
 * Set settings Object before env parse.
 *
 * @param {Object} options
 * @returns {Object} settings
 */
function setSettings (options) {
    return Object.assign({}, defaults, options);
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
 * Add envs to global process.env array
 *
 * @param {Array} row
 */
function setProcessEnv (row) {
    if (row) {
        let
            env = row.match(/^([\w\.\-]+)=(.*)$/i),
            key = env[1],
            val = env[2];

        process.env[key.toUpperCase()] = val;
    }
}
