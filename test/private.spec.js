'use strict';

const
    lib = require('../lib/dotenv-lib'),
    chai = require('chai'),
    assert = chai.assert;

describe('dotenv-loader private methods', () => {
    describe("#_setSettings()", () => {
        it('should return object with only default values', () => {
            let settings = lib.setSettings();

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
                settings = lib.setSettings(options);

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
                result = lib.readEnvFile(options),
                expectedLength = 8; // blank lines counted

            assert.isArray(result);
            assert.equal(expectedLength, result.length);
        });
    });

    describe("#_setProcessEnv", () => {
        it('should assign key / value pair to process.env array', () => {
            let
                row = "ROW_TEST_ENV=works fine";

            lib.setProcessEnv(row);

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

            lib.setProcessEnv(setRow);
            assert.equal(after, process.env[key]);
        });

        it('should set key and value properly for every case', () => {
            let cases = [
                {case: 'LTEST=123', key: 'LTEST', value: 123},
                {case: 'L-TEST=test', key: 'L-TEST', value: 'test'},
                {case: 'L_TEST=asdf', key: 'L_TEST', value: 'asdf'},
                {case: 'L.TEST=0', key: 'L.TEST', value: 0},
                {case: 'R TEST=345', key: 'R_TEST', value: '345'},
                {case: 'low test=aaa', key: 'low_test', value: 'aaa'},
                {case: '  left pad  = bbb', key: 'left_pad', value: 'bbb'},
            ];

            cases.forEach(function (case_) {
                lib.setProcessEnv(case_.case);
                assert.equal(process.env[case_.key], case_.value);
            });
        });
    });
});
