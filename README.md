# Dotenv-loader v2.0.1

Load additional environmental variables from single .env file
and manage them on runtime.
With dotenv-loader you can easily access NodeJS environment
variables from different sources.

## Description

Variables are available from:

* Environment created by NodeJS,
* Set for shell session,
* Saved in custom .env file,

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

## Installation

With NPM:

```shell
npm install -S dotenv-loader
```

For older NodeJS:

```shell
npm install -S dotenv-loader@1.2.1
```

# Usage

Make sure, that dotenv-loader is invoke before main script.
Dotenv-loader will parse synchronously your `.env` file,
and set environment variables to `process.env` array before booting App.

## Load environments

`env.load([options]);`

* @param options {Object} An optional object with `file` and `encoding`
* @return {EventEmitter} emits 'error' event **since v.1.1.0**

*.env file Example with all recommended formats:*

```text
WELCOME_MSG=Hi there!
SINGLE=word
WITH-HYPHEN=foo
WITH.DOT=true
WHITE SPACE=allowed
lowercase=works fine
spaces between = and value
```

There is no need to put strings in quotes.
All quote characters on the right hand side will be included to string itself.

For example:
```text
SECRET = "this is secret string"
```

Will return as: `'"this is secret string"'`

At the top of your main script, before application start,
call `.load()` method to set additional
environments from `.env` file.

```javascript
const
    optionalSettings = {
        file: "./other/path/to/.env", // default: .env
        encoding: "unicode", // default: utf8
    },
    env = require('dotenv-loader');

env.load(optionalSettings).on('error', (err) => console.log(err));
```

## Get environments

`env.get(key[, default][, callback]);`
* @param key {String} environment variable key
* @param default {*} an optional default value if variable was not set
* @param callback {Function} an optional callback function as last parameter
* @return {Any} environment value

Optional callback function takes three parameters:

* @param val {*} value from environment variable
* @param key {String} variable key
* @param defaults {*} value passed as default fallback

```javascript
const
    env = require('dotenv-loader'),
    myVariable = env.get('WELCOME_MSG', 'Hi!');
```

## Throw error if environment variable does not exist

Method `.get()` takes optional callback as last argument.

```javascript
let
    val = env.get('NOT_EXIST', 'default val', (val, key, defaults) => {
        console.log(key, val, defaults);
        if (val === null) {
            throw Error('Env variable does not exist');
        }
    });
```

## Full Example

```javascript
const env = require('dotenv-loader');
env.load().on('error', (err) => throw Error(err));

if (env.get('NODE_ENV') === 'development') {
    console.log('I am in development mode');
}

```

# Changelog

## v2.0.1 2018-01-20

Goal: Minor bugs fix.

**Patch:**

- Removed unnecessary whitespace replacement on variable parsing,
- Protection against corrupted .env key=value pair,
- More test cases for .env parser,

## v2.0.0 2018-01-19

Goal: Upgrade to NodeJS 8.x and remove normalization for more flexibility.

**Major:**

- Require NodeJS>=8.9,
- Allow for lower case variable names (will not normalize to upper case),
- Trim keys and values from .env file on load,

**Minor:**

- Allow for spaces in variable keys (will be normalize to underscore),
- Allow for white spaces before and after equal character
  for example: `ENV_KEY = env value`,

# Contribution

Did you find any bugs?

Maybe this documentation has language mistakes?

You have idea for great new feature?


Create new issue and describe your point of view.
I will do my best to meet all requests.

This repository is open for changes and suggestions.
I encourage you to write your own solution and make pull request.

# LICENSE
The MIT License (MIT)
Copyright (c) 2016 Paweł Zadrożny
