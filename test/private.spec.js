'use strict';

const
    env = require('../dotenv-loader'),
    chai = require('chai'),
    assert = chai.assert;

describe('dotenv-loader private methods', () => {
    describe("#_setSettings()", () => {
        it('should return object with only default values', () => {
            let settings = env.__private._setSettings();

            assert.isDefined(settings.file);
            assert.isDefined(settings.encoding);

            assert.equal('.env', settings.file);
            assert.equal('utf8', settings.encoding);
        });

        it('should return object with custom values', () => {
            let
                options = {
                    file: ".test-env",
                    encoding: "unicode"
                },
                settings = env.__private._setSettings(options);

            assert.isDefined(settings.file);
            assert.isDefined(settings.encoding);

            assert.equal('.test-env', settings.file);
            assert.equal('unicode', settings.encoding);
        });
    });

    describe("#_readEnvFile()", () => {
        it('should return array with keys and values split on rows', () => {
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
        it('should assign key / value pair to process.env array', () => {
            let
                row = "ROW_TEST_ENV=works fine";

            env.__private._setProcessEnv(row);

            assert.isDefined(process.env['ROW_TEST_ENV']);
            assert.equal('works fine', process.env['ROW_TEST_ENV']);
        });

        it('should overwrite key / value pair in process.env array', () => {
            let
                key = "ROW_TEST_ENV",
                before = 'before overwrite',
                after = 'after overwrite I am different!',
                setRow = `${key}=${after}`;

            process.env[key] = before;
            assert.equal(before, process.env[key]);

            env.__private._setProcessEnv(setRow);
            assert.equal(after, process.env[key]);
        });
    });
});
