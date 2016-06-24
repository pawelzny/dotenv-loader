'use strict';

const
    env = require('../env-loader'),
    chai = require('chai'),
    assert = chai.assert;

describe('env-loader private methods', () => {
    describe("#_setSettings()", () => {
        it('Should return merged settings object with default values', () => {
            let settings = env.__private._setSettings();

            assert.isDefined(settings.file);
            assert.isDefined(settings.encoding);

            assert.equal('.env', settings.file);
            assert.equal('utf8', settings.encoding);
        });

        it('Should return merged settings object with custom values', () => {
            let
                options = {
                    file: "test-env",
                    encoding: "unicode"
                },
                settings = env.__private._setSettings(options);

            assert.isDefined(settings.file);
            assert.isDefined(settings.encoding);

            assert.equal('test-env', settings.file);
            assert.equal('unicode', settings.encoding);
        });
    });

    describe("#_readEnvFile()", () => {
        it('Should return array with data rows from .env file', () => {
            let
                options = {
                    file: "./test/.test-env",
                    encoding: "utf8"
                },
                result = env.__private._readEnvFile(options),
                expectedLength = 8; // blank lines counted

            assert.isArray(result);
            assert.equal(expectedLength, result.length);
        });
    });

    describe("#_setProcessEnv", () => {
        it('Should set given value to process environmant array', () => {
            let
                row = "ROW_TEST_ENV=works fine";

            env.__private._setProcessEnv(row);

            assert.isDefined(process.env['ROW_TEST_ENV']);
            assert.equal('works fine', process.env['ROW_TEST_ENV']);
        });
    });
});
