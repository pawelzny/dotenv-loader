'use strict';

const
    fs = require('fs'),
    typer = require('typer'),
    defaults = {
        file: ".env",
        encoding: "utf8"
    };

module.exports = {load, get, __private: {_setProcessEnv, _setSettings, _readEnvFile}};

/**
 * Load .env file and add key/value pairs to global process.env array
 *
 * @param {Object} options
 */
function load (options) {
    let
        settings = _setSettings(options);

    try {
        _readEnvFile(settings).forEach(_setProcessEnv);
    } catch (err) {
        console.log('.env file load and parse fatal error \n', err);
    }
}

/**
 * Helper function to get process.env or default settings
 *
 * @param {String} key
 * @param {Any} defaults
 * @returns {Any}
 */
function get (key, defaults) {
    let
        val = process.env[key.toUpperCase()],
        envType = typer.detect(val),
        callback = arguments[-1];

    if (typer.detect(callback) === 'function') {
        callback(val, key, defaults);
    }
    return val ? typer.cast(val, envType) : defaults || null;
}

/**
 * Set settings Object before env parse.
 *
 * @param {Object} options
 * @returns {Object} settings
 */
function _setSettings (options) {
    return Object.assign({}, defaults, options);
}

/**
 * Read env file and return array of rows.
 *
 * @param {Object} settings
 * @returns {Array} env rows
 */
function _readEnvFile (settings) {
    return fs.readFileSync(settings.file, {encoding: settings.encoding}).split('\n');
}

/**
 * Add envs to global process.env array
 *
 * @param {Array} row
 */
function _setProcessEnv (row) {
    if (row) {
        let
            env = row.match(/^([\w\.\-]+)=(.*)$/i),
            key = env[1],
            val = env[2];

        process.env[key.toUpperCase()] = val;
    }
}
