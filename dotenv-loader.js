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
 * @returns {EventEmitter} event
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
 * @param {*} defaults
 * @returns {*} environment value or default
 */
function get (key, defaults=null) {
    let
        val = process.env[key],
        envType = typer.detect(val),
        callback = lastCallback(...arguments);

    callback(val, key, defaults);
    return val ? typer.cast(val, envType) : defaults;
}
