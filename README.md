#Dotenv-loader v.1.1.0

##Description

Dotenv-loader module helps setting environment variables on runtime.
You do not need to preset environment variables when calling your script with terminal or supervisor.

Make sure, that dotenv-loader is required on the begining of your main script.
Dotenv-loader will parse synchronously your .env file, and set environment variables to process.env array before booting App.

##Requirements

NodeJS >= 6.2.0

##Instalation

With NPM:
```javascript
npm install -S dotenv-loader
```

##Load environments

`env.load([options]);`
* @param options {Object} An optional object with `file` and `encoding` propertis
* @return {EventEmitter} emits 'error' event **since v.1.1.0**


*.env file Example:*
```javascript
THROW_ERROS=false
PAGE_ELEMENTS=100
WELCOME_MSG=Hi there!
```

Every white character will be included into value.
There is no need to put strings in quotes. Quotes will be included as part of actual string.

On the begining of your main script require dotenv-loader and call `.load()` method:
```javascript
const
    optionalSettings = {
        file: "./other/path/to/.env", // default: .env
        encoding: "unicode" // default: utf8
    },
    env = require('dotenv-loader');

env.load(optionalSettings).on('error', (err) => console.log(err));
// There you go.
// Your environment variables are now available globally.
```

Since v.1.1.0 Loader emits "error" event when environment file parsing has failed.
It may crash your app because there is no certainty that all environment variables was properly set to process.env

You should properly handle this kind of failure.

##Get environments

`env.get(key[, default][, callback]);`
* @param key {String} environment variable key
* @param default {String} an optional default value if variable was not set
* @param callback {Function} an optional callback function as last parameter
* @return {Any} environment value

Optional callback function takes three parameters:
```javascript
@param val {Any} value from environment variable
@param key {String} variable key
@param defaults {Any} value passed as default fallback
```

```javascript
const
    env = require('dotenv-loader'),
    myVariable = env.get('WELCOME_MSG', 'Or default value');

console.log(myVariable); // Hi there!
```

You can still get environment variables straight from process.env
```javascript
process.env['WELCOME_MSG']; // Hi there!
process.env.WELCOME_MSG; // Hi there!
```
All your variable keys will be normalized to uppercase, but when you use env.get() method you can use upper and lower case.

###Throw error if environment variable does not exist

You can pass callback function as last parameter. It will be called asynchronously, and still return a value.
```javascript
let
    val = env.get('NOT_EXIST', 'default val', (val, key, defaults) => {
        console.log(val); // null
        console.log(key); // NOT_EXIST
        console.log(defaults); // default val

        if (val === null) {
            throw Error('Env variable does not exist');
        }
    }); // throws [Error: Env variable does not exist']
```

##Full Example

```javascript
const env = require('dotenv-loader');
env.load().on('error', (err) => throw Error(err));

// Rest of your code

let nodeEnv = env.get('NODE_ENV', (val) => console.log('Current environment is: %s', val));

if (nodeEnv === 'development') {
    console.log('I am in development mode');
}

```

##Contribution

Feel free to Pull Request

##LICENSE
The MIT License (MIT)
Copyright (c) 2016 Paweł Zadrożny
