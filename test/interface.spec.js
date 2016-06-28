'use strict';

const
    env = require('../dotenv-loader'),
    chai = require('chai'),
    assert = chai.assert,
    sinon = require('sinon');

describe('dotenv-loader interface', () => {
    beforeEach(() => {
        env.load({file: "./test/.test-env"});
    });

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
            env.load().on('error', (err) => {
                assert.isDefined(err);
            });
        });
    });

  describe('#get()', () => {
    it('should parse .env and return value type of Boolean (true)', () => {
        assert.isTrue(env.get('TEST_BOOLEAN_TRUE'));
        assert.isTrue(env.get('test_boolean_true'));
    });

    it('should parse .env and return value type of Boolean (false)', () => {
        assert.isFalse(env.get('TEST_BOOLEAN_FALSE'));
        assert.isFalse(env.get('test_boolean_false'));
    });

    it('should parse .env and return value type of Number', () => {
        assert.isNumber(env.get('TEST_NUMBER'));
        assert.isNumber(env.get('test_number'));
    });

    it('should parse .env and return value type of String', () => {
        assert.equal("this is test string", env.get('TEST_STRING'));
        assert.equal("this is test string", env.get('test_string'));
    });

    it('should parse .env and return value type of Null when value was set to "undefined"', () => {
        assert.isNull(env.get('TEST_UNDEFINED'));
        assert.isNull(env.get('test_undefined'));
    });

    it('should parse .env and return value type of Null when value was set to "null"', () => {
        assert.isNull(env.get('TEST_NULL'));
        assert.isNull(env.get('test_null'));
    });

    it('should parse .env and return value type of Null when value has not been set', () => {
        assert.isNull(env.get('TEST_NOT_SET'));
        assert.isNull(env.get('test_not_set'));
    });

    it('should parse .env and return default value when value has not been set', () => {
        let
            defaultVal = env.get('TEST_NOT_SET', 'default');

        assert.equal('default', defaultVal);
    });

    it('should throw an error when value has not been set', () => {
        try {
            env.get('THIS_DO_NOT_EXISTS', function (val, key, defaults) {
                if (val === null) {
                    throw Error('Env variable not exists');
                }
            });
        } catch (err) {
            assert.equal('Error: Env variable not exists', err);
        }
    });

    it('should run the callback asynchronously and return value synchronously', () => {
        let
            expectedNumber = 100,
            testKey = 'TEST_NUMBER',
            defaultNumber = 1,
            number = env.get(testKey, defaultNumber, function (val, key, defaults) {
                assert.equal(expectedNumber, val);
                assert.equal(testKey, key);
                assert.equal(defaultNumber, defaults);
            });

        assert.isDefined(number);
        assert.equal(expectedNumber, number);
    });

    it('should not run any callback if last parameter is not a function', () => {
        env.get('TEST_NUMBER', 'default', true);
    });

    it('should run the callback once if last parameter is a function', () => {
        let
            callbackSpy = sinon.spy();

        env.get('TEST_KEY', function () {
            callbackSpy();
        });

        assert.isTrue(callbackSpy.calledOnce);
    });
  });
});
