#Env-loader

**Load environment variables from .env file, and set to process.env Array.**
Under MIT license.

```javascript
npm install -S env-loader
```

##Load environments

* Create .env file in your project root directory,
* Your .env file should contain key=variable pairs, one in a row,

*example:*

```javascript
THROW_ERROS=false
PAGE_ELEMENTS=100
WELCOME_MSG=Hi there!
```

Every white character will be included in value.
There is no need to put strings in quotes. Quotes will be included as part of actual string.

To use loader place this at the top of your index.js

```javascript
const
    optionalSettings = {
        file: "./other/path/to/.env", // default: .env
        encoding: "unicode" // default: utf8
    },
    env = require('env-loader');

env.load(optionalSettings); // There you go. Your environment variables are now available globally.
```

##Get environments

To get environment value (node predefine included):

```javascript
const
    env = require('env-loader'),
    myVariable = env.get('WELCOME_MSG', 'Or default value if MY_VARIABLE is not set');

console.log(myVariable); // Hi there!
```

You can still get environment variables straight through process.env
```javascript
process.env['WELCOME_MSG']; // Hi there!
```
All your variable keys will be normalized to uppercase, but when you use env.get() method you can use upper and lower case.

##Throw error if environment variable does not exists

You can pass callback function as last parameter. It will be called asynchronously, and still return a value.

```javascritp
let val = env.get('THIS_DO_NOT_EXISTS', 'default value', function (val, key, defaults) {
    if (val === null) {
        throw Error('Env variable not exists');
    }
}); // throws [Error: Env variable not exists']
```

Callback function takes three parameters:

```javascript
// for previous example:
val === null // parsed value
key === 'THIS_DO_NOT_EXISTS' // given key
defaults === 'default value' // given defaults
```
