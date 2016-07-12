'use strict';

const
    lib = require('./lib/dotenv-lib'),
    typer = require('typer'),
    lastCallback = require('last-callback'),
    EventEmitter = require('events');

module.exports = {load, get};

/**
 * Load .env file and add key/value pairs to global process.env array
 *
 * @param {Object} options
 */
function load (options) {
    let
        settings = lib.setSettings(options),
        event = new EventEmitter();

    try {
        lib.readEnvFile(settings).forEach(lib.setProcessEnv);
    } catch (err) {
        event.emit('error', err);
    } finally {
        return event;
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
        callback = lastCallback(...arguments);

    callback(val, key, defaults);
    return val ? typer.cast(val, envType) : defaults || null;
}
