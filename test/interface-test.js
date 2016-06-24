'use strict';

const
    env = require('../env-loader'),
    chai = require('chai'),
    assert = chai.assert;

env.load({file: "./test/.test-env"});

describe('env-loader public interface', () => {
    describe("#load()", () => {
        it('should load .env file and assign to global process.env Array', () => {
            assert.isDefined(process.env['TEST_BOOLEAN_TRUE']);
            assert.isDefined(process.env['TEST_BOOLEAN_FALSE']);
            assert.isDefined(process.env['TEST_NUMBER']);
            assert.isDefined(process.env['TEST_STRING']);
            assert.isDefined(process.env['TEST_NULL']);
            assert.isDefined(process.env['TEST_NOT_SET']);
        });
    });

  describe('#get()', () => {
    it('should return boolean (true) value from parsed .env', () => {
        assert.isTrue(env.get('TEST_BOOLEAN_TRUE'));
        assert.isTrue(env.get('test_boolean_true'));
    });

    it('should return boolean (false) value from parsed .env', () => {
        assert.isFalse(env.get('TEST_BOOLEAN_FALSE'));
        assert.isFalse(env.get('test_boolean_false'));
    });

    it('should return number value from parsed .env', () => {
        assert.isNumber(env.get('TEST_NUMBER'));
        assert.isNumber(env.get('test_number'));
    });

    it('should return string value from parsed .env', () => {
        assert.equal("this is test string", env.get('TEST_STRING'));
        assert.equal("this is test string", env.get('test_string'));
    });

    it('should return null when value is "undefined" string', () => {
        assert.isNull(env.get('TEST_UNDEFINED'));
        assert.isNull(env.get('test_undefined'));
    });

    it('should return null value from parsed .env', () => {
        assert.isNull(env.get('TEST_NULL'));
        assert.isNull(env.get('test_null'));
    });

    it('should return null value when none was set in .env file', () => {
        assert.isNull(env.get('TEST_NOT_SET'));
        assert.isNull(env.get('test_not_set'));
    });

    it('should return default value when none was set in .env file', () => {
        assert.equal('default', env.get('TEST_NOT_SET', 'default'));
    });

    it('should throw an error when value is not define in .env file', () => {
        try {
            env.get('THIS_DO_NOT_EXISTS', 'default value', function () {
                throw Error('Env variable not exists');
            });
        } catch (err) {
            assert.equal('Error: Env variable not exists', err);
        }
    });

    it('should not throw an error when value exists', () => {
        let number = env.get('TEST_NUMBER', 'default value', function () {
            throw Error('Env variable not exists');
        });

        assert.isDefined(number);
    });

    it('should run callback even if value exists, and then returns value', () => {
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

    it('should not run callback if last parameter is not a function', () => {
        env.get('TEST_NUMBER', 'default', true);
    });
  });
});
