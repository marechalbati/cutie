<img src="https://github.com/Guseyn/logos/raw/master/cutie.svg?sanitize=true">

[![NPM Version][npm-image]][npm-url]

<b>Cutie</b> is a lightweight library without any external dependencies, the main point of which is just to provide user with abstractions that make asynchronous code in Node simple and declarative. It's an implementation of the [Async Tree Pattern](https://github.com/Guseyn/async-tree-patern/blob/master/Async_Tree_Patern.pdf).

# Motivation
Let's say we want to read content from a file and write it to another one. And all these operations are asynchronous, of course. So, instead of writing something like this:
```js
fs.readFile('./../file1.txt', 'utf8', (err, result) => {
  if (err != null) {
    throw err;
  }
 
  fs.writeFile('/../file2.txt', result, (err) => {
    if (err != null) {
      throw err;
    }
  });
});
```
we can design our code in the following style:
```js
new WrittenFile(
  './../file2.txt',
  new ReadFile('./../file1.txt', 'utf8')
).call();
```
# How to use
You can use Cutie as a dependency via npm:
<b>npm install @cuties/cutie</b>
```js
const AsyncObject = require('@cuties/cutie').AsyncObject;
const fs = require('fs');

class WrittenFile extends AsyncObject {

  constructor(path, content) {
    super(path, content);
  }
  
  definedAsyncCall() {
    return fs.writeFile;
  }
  
}
```
```js
const AsyncObject = require('@cuties/cutie').AsyncObject;
const fs = require('fs');

class ReadFile extends AsyncObject {

  constructor(path, encoding) {
    super(path, encoding);
  }
  
  definedAsyncCall() {
    return fs.readFile;
  }

}
```
AsyncObject also provides methods `OnResult` and `OnError`, so that you can process the `result` from async call and handle an `error` in the specific way (error is being thrown by default).

Let's say we want to read a json file and parse all information from there. Cutie provides two ways. First of them is just to create <b>ReadJsonFile</b> async object like this:
```js
const AsyncObject = require('@cuties/cutie').AsyncObject;
const fs = require('fs');

class ReadJsonFile extends AsyncObject {
  
  constructor(path, encoding) {
    super(path, encoding);
  }
  
  definedAsyncCall() {
    return fs.readFile;
  }
  
  onResult(result) {
    return JSON.parse(result);
  }

}

// usage
new ReadJsonFile('./../file.txt', 'utf8').call();
```
<b>ReadJsonFile</b> also could be designed like this:
```js
const fs = require('fs');
const ReadFile = require('./ReadFile');

class ReadJsonFile extends ReadFile {
  
  constructor(path, encoding) {
    super(path, encoding);
  }
  
  onResult(result) {
    return JSON.parse(result);
  }

}

// usage
new ReadJsonFile('./../file.txt', 'utf8').call();
```
Or you can use <b>ReadFile</b> with <b>ParsedJson</b> that looks like this:
```js
const AsyncObject = require('@cuties/cutie').AsyncObject;
const fs = require('fs');
const ReadFile = require('./ReadFile');

class ParsedJson extends AsyncObject {

  constructor(text) {
    super(text);
  }
  
  /*
    you can't call here async operations with I/O
  */
  definedSyncCall() {
    return (text) => {
      return JSON.parse(text);
    }
  }

}

// usage
new ParsedJson(
  new ReadFile('./../file.txt', 'utf8')
).call();
```
[Learn more](http://guseyn.com/post-reconsidering-async-object-with-cutie#intro).

Also Cutie provides <b>Event</b> abstraction for event listeners in Node. [Read more](http://guseyn.com/post-event-new-abstraction-in-cutie#intro).

# Updates:

`As` conception: [Read](http://guseyn.com/post-as-conception#intro).

API of `As` conception is changed (since v.1.3.7): [Read](http://guseyn.com/post-after-conception#intro).

Consider the following example with async tree:
```js
new SavedNewAccountOfUser(
  new RetrievedUser(userId),
  new RetrievedOldAccountOfUser(
    new RetrievedUser(userId)
  )
).call();
```
So, here we try to save new account for user that based(somehow) on its old one. And as you can see, we retrieve user here twice. `RetrievedUser` might be a quite expensive operation, so we don't want to do it more than one time.

Cutie proposes following solution:

```js
new RetrievedUser(userId).as('user')
  .after(
    new SavedNewAccountOfUser(
      as('user'),
      new RetrievedOldAccountOfUser(
        as('user')
      )
    )
  ).call();
```
Every `async object` can has `as(key)` method, which says to the `async object` that it must save its represented value(result) into the cache with the specified `key`.

If `as(key)` method is used as independent(separate) function, it returns `AsyncObject`, which represented value is cached value from the cache with the specified `key`.

<b>Sequence of async trees</b>(about `after` word): [Read](http://guseyn.com/post-after-conception#intro).

## Run test

`npm test`

## Libraries that use cutie

[node-test-executor](https://github.com/Guseyn/node-test-executor), [cutie-is](https://github.com/Guseyn/cutie-is), [cutie-assert](https://github.com/Guseyn/cutie-assert), [cutie-fs](https://github.com/Guseyn/cutie-fs), [cutie-http](https://github.com/Guseyn/cutie-http), [cutie-https](https://github.com/Guseyn/cutie-http), [cutie-rest](https://github.com/Guseyn/cutie-rest), [cutie-buffer](https://github.com/Guseyn/cutie-buffer), [cutie-error](https://github.com/Guseyn/cutie-error), [cutie-date](https://github.com/Guseyn/cutie-date), [cutie-json](https://github.com/Guseyn/cutie-json), [cutie-event](https://github.com/Guseyn/cutie-event), [cutie-stream](https://github.com/Guseyn/cutie-stream), [cutie-object](https://github.com/Guseyn/cutie-object), [cutie-process](https://github.com/Guseyn/cutie-process), [cutie-iterator](https://github.com/Guseyn/cutie-iterator), [cutie-path](https://github.com/Guseyn/cutie-path), [cutie-if-else](https://github.com/Guseyn/cutie-if-else), [cutie-cluster](https://github.com/Guseyn/cutie-cluster), [page-static-generator](https://github.com/Guseyn/page-static-generator).

[npm-image]: https://img.shields.io/npm/v/@cuties/cutie.svg
[npm-url]: https://npmjs.org/package/@cuties/cutie
