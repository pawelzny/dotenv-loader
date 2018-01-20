# Dotenv-loader v.2.0.0

Load additional environmental variables from single .env file and manage them on runtime.
With dotenv-loader you can easily access NodeJS environment variables from different sources.

## Description

Variables are available from:

* Environment created by NodeJS,
* Exported in shell session,
* Set by Apache/Nginx
* Saved in custom .env file

For what do I need .env file?
It is the easiest way to store all kind of secrets and manage application state.
For example when many developers works on one application, everyone can
independently defined its own database connection, API keys and other
secrets which should not be shared between developers and production.

[![npm](https://img.shields.io/npm/l/dotenv-loader.svg?maxAge=2592000)]()
[![npm](https://img.shields.io/npm/dt/dotenv-loader.svg?maxAge=2592000)]()
[![node](https://img.shields.io/node/v/dotenv-loader.svg?maxAge=2592000)]()
[![CircleCI](https://img.shields.io/circleci/project/github/pawelzny/dotenv-loader.svg)]()
[![Maintenance](https://img.shields.io/maintenance/yes/2018.svg?maxAge=2592000)]()
[![coverage](https://img.shields.io/badge/coverage-100%25-brightgreen.svg)]()

## Requirements

NodeJS >= 8.9.0

<div style="color: red; font-weight: 700;">
For NodeJS 6.x and 7.x use dotenv-loader version 1.2.1
</div>

## Instalation

With NPM:

```shell
npm install -S dotenv-loader
```

For older NodeJS:

```shell
npm install -S dotenv-loader@1.2.1
```

# Usage

Make sure, that dotenv-loader is required on the begining of your main script.
Dotenv-loader will parse synchronously your .env file, and set environment variables to process.env array before booting App.

## Load environments

`env.load([options]);`

* @param options {Object} An optional object with `file` and `encoding` propertis
* @return {EventEmitter} emits 'error' event **since v.1.1.0**


*.env file Example:*

```text
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
// Your environment variables are now available globally.
```

Since v.1.1.0 Loader emits "error" event when environment file parsing has failed.
It may crash your app because there is no certainty that all environment variables was properly set to process.env

You should properly handle this kind of failure.

## Get environments

`env.get(key[, default][, callback]);`
* @param key {String} environment variable key
* @param default {String} an optional default value if variable was not set
* @param callback {Function} an optional callback function as last parameter
* @return {Any} environment value

Optional callback function takes three parameters:

* @param val {Any} value from environment variable
* @param key {String} variable key
* @param defaults {Any} value passed as default fallback

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

## Throw error if environment variable does not exist

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

## Full Example

```javascript
const env = require('dotenv-loader');
env.load().on('error', (err) => throw Error(err));

// Rest of your code

let nodeEnv = env.get('NODE_ENV', (val) => {
    console.log('Current environment is: %s', val)
});

if (nodeEnv === 'development') {
    console.log('I am in development mode');
}

```

## Contribution

Did you find any bugs?

Maybe this documentation has language mistakes?

You have idea for great new feature?


Create new issue and describe your point of view.
I will do my best to meet all requests.

This repository is open for changes and suggestions.
I encourage you to write your own solution and make pull request.

## LICENSE
The MIT License (MIT)
Copyright (c) 2016 Paweł Zadrożny
