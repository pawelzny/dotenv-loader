'use strict';

const
    lib = require('../lib/dotenv-lib'),
    chai = require('chai');

describe('dotenv-loader private methods', () => {
    describe("#_setSettings()", () => {
        it('should return object with only default values', () => {
            let settings = lib.setSettings();

            chai.assert.isDefined(settings.file);
            chai.assert.isDefined(settings.encoding);

            chai.assert.equal('.env', settings.file);
            chai.assert.equal('utf8', settings.encoding);
        });

        it('should return object with custom values', () => {
            let
                options = {
                    file: ".test-env",
                    encoding: "unicode"
                },
                settings = lib.setSettings(options);

            chai.assert.isDefined(settings.file);
            chai.assert.isDefined(settings.encoding);

            chai.assert.equal('.test-env', settings.file);
            chai.assert.equal('unicode', settings.encoding);
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

            chai.assert.isArray(result);
            chai.assert.equal(expectedLength, result.length);
        });
    });

    describe("#_setProcessEnv", () => {
        it('should assign key / value pair to process.env array', () => {
            let
                row = "ROW_TEST_ENV=works fine";

            lib.setProcessEnv(row);

            chai.assert.isDefined(process.env['ROW_TEST_ENV']);
            chai.assert.equal('works fine', process.env['ROW_TEST_ENV']);
        });

        it('should overwrite key / value pair in process.env array', () => {
            let
                key = "ROW_TEST_ENV",
                before = 'before overwrite',
                after = 'after overwrite I am different!',
                setRow = `${key}=${after}`;

            process.env[key] = before;
            chai.assert.equal(before, process.env[key]);

            lib.setProcessEnv(setRow);
            chai.assert.equal(after, process.env[key]);
        });

        it('should throw when key is not defined', () => {
            try {
                lib.setProcessEnv("=no key on the left");
            } catch (err) {
                chai.assert.equal(err.message, "Environment KEY=VALUE pair for '=no key on the left' is corrupted.");
            }
        });

        let cases = [
            {case: 'STANDARD=1', key: 'STANDARD', value: '1'},
            {case: 'WITH-HYPHEN=foo', key: 'WITH-HYPHEN', value: 'foo'},
            {case: 'WITH_UNDERSCORE="bar"', key: 'WITH_UNDERSCORE', value: '"bar"'},
            {case: 'WITH.DOT=true', key: 'WITH.DOT', value: 'true'},
            {case: 'WHITE SPACE=null', key: 'WHITE SPACE', value: 'null'},
            {case: 'lowercase=', key: 'lowercase', value: ''},
            {case: '    left pad=abcd', key: 'left pad', value: 'abcd'},
            {case: 'right pad    =xyz', key: 'right pad', value: 'xyz'},
            {case: 'left pad value=    left pad', key: 'left pad value', value: 'left pad'},
            {case: 'right pad value=right pad    ', key: 'right pad value', value: 'right pad'},
        ];

        cases.forEach(function (case_) {
            it(`should set key and value for: ${case_.case}`, () => {
                lib.setProcessEnv(case_.case);
                chai.assert.equal(process.env[case_.key], case_.value);
            });
        });
    });
});
