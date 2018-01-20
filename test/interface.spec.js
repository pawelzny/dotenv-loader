'use strict';

const
    env = require('../dotenv-loader'),
    chai = require('chai'),
    assert = chai.assert,
    sinon = require('sinon');

describe('dotenv-loader interface', () => {
    beforeEach(() => env.load({file: "./test/.test-env"}));

    describe("#load()", () => {
        it('should load .env file and assign to process.env', () => {
            assert.isDefined(process.env['TEST_BOOLEAN_TRUE']);
            assert.isDefined(process.env['TEST_BOOLEAN_FALSE']);
            assert.isDefined(process.env['TEST_NUMBER']);
            assert.isDefined(process.env['TEST_STRING']);
            assert.isDefined(process.env['TEST_NULL']);
            assert.isDefined(process.env['TEST_NOT_SET']);
        });

        it('should emit error event when failed to load .env file', () => {
            env.load().on('error', (err) => assert.isDefined(err));
        });
    });

    describe('#get()', () => {
        it('should parse .env and return value type of Boolean (true)', () => {
            assert.isTrue(env.get('TEST_BOOLEAN_TRUE'));
        });

        it('should parse .env and return value type of Boolean (false)', () => {
            assert.isFalse(env.get('TEST_BOOLEAN_FALSE'));
        });

        it('should parse .env and return value type of Number', () => {
            assert.isNumber(env.get('TEST_NUMBER'));
        });

        it('should parse .env and return value type of String', () => {
            assert.equal("this is test string", env.get('TEST_STRING'));
        });

        it('should parse .env and return value type of Null when value was set to "undefined"', () => {
            assert.isNull(env.get('TEST_UNDEFINED'));
        });

        it('should parse .env and return value type of Null when value was set to "null"', () => {
            assert.isNull(env.get('TEST_NULL'));
        });

        it('should parse .env and return value type of Null when value has not been set', () => {
            assert.isNull(env.get('TEST_NOT_SET'));
        });

        it('should parse .env and return default value when value has not been set', () => {
            let defaultVal = 'default';
            assert.equal(env.get('TEST_NOT_SET', defaultVal), defaultVal);
        });

        it('should throw an error when value has not been set', () => {
            try {
                env.get('THIS_DO_NOT_EXISTS', (val) => {
                    if (val === null) {
                        throw Error('Env variable not exists');
                    }
                });
            } catch (err) {
                assert.equal('Error: Env variable not exists', err);
            }
        });

        it('should run the callback and return environment value', () => {
            let
                expectedNumber = 100,
                testKey = 'TEST_NUMBER',
                defaultNumber = 1,
                number = env.get(testKey, defaultNumber, (val, key, defaults) => {
                    assert.equal(expectedNumber, val);
                    assert.equal(testKey, key);
                    assert.equal(defaultNumber, defaults);
                });

            assert.isDefined(number);
            assert.equal(number, expectedNumber);
        });

        it('should not run any callback if last parameter is not a function', () => {
            env.get('TEST_NUMBER', 'default', true);
        });

        it('should run the callback once if last parameter is a function', () => {
            let spy = sinon.spy();
            env.get('TEST_KEY', () => spy());

            assert.isTrue(spy.calledOnce);
        });
    });
});
