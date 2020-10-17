# find-duplicated-property-keys

 [![npm version](https://badge.fury.io/js/find-duplicated-property-keys.svg)](https://badge.fury.io/js/find-duplicated-property-keys)
 [![Build Status](https://travis-ci.com/SebastianG77/find-duplicated-property-keys.svg?branch=master)](https://travis-ci.com/SebastianG77/find-duplicated-property-keys)
 [![Coverage Status](https://coveralls.io/repos/github/SebastianG77/find-duplicated-property-keys/badge.svg?branch=master)](https://coveralls.io/github/SebastianG77/find-duplicated-property-keys?branch=master)
 [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

A package for detecting all duplicated property keys of a JSON string. It can either be used as a standalone tool for validating JSON files or as a submodule for other Node.js projects.


### Use as a Standlone Tool

If you like to use `find-duplicated-property-keys` as a standalone tool, you first have to install it by using the following command:

```bash
$ npm install find-duplicated-property-keys
```

To run this tool you simply need to execute it from the installation directory like this:

```bash
$ node_modules/.bin/find-duplicated-property-keys -s <path-to-json-file>
```

Of course, if you prefer a more comfortable way of running this tool, you can also install it globally by using this command:

```bash
$ npm install -g find-duplicated-property-keys
```

Then you can run `find-duplicated-property-keys` from any directory by using the following command:

```bash
$ find-duplicated-property-keys -s <path-to-json-file>
```

When running the tool from terminal, it will list all duplicated property keys followed by the number of their occurrence or return a notification to indicate the JSON file does not contain any duplicated property keys. In addition to that, `find-duplicated-property-keys` will then also return one of the following exit codes:

|Exit Code|Description|
|:--|:--|
|0|The passed JSON file has been analyzed succesfully and no duplicated property keys have been detected. Note, this exit code will also be returned, if the help text has been requested by either running `find-duplicated-property-keys` without any parameters or with the parameter `--help` or its alias `-h` solely.|
|1|An exception has been thrown by the tool and the validation process was unable to determine a result.|
|101|The passed JSON file has been analyzed succesfully and at least one duplicated property key has been detected.|


### Use as a Submodule

In case you need to include `find-duplicated-property-keys` into another project, you first have to add it to your Node.js application by executing the following command while being in the root directory of your project:

```bash
$ npm install find-duplicated-property-keys
```

To validate a JSON string you can run the module as described in the following example:

```javascript
const findDuplicatedPropertyKeys = require('find-duplicated-property-keys');

const jsonString = '{"name": "Carl", "name": "Carla", "age": 29}';

const result = findDuplicatedPropertyKeys(jsonString);

console.log(result.toString()); // <instance>.name
```

The returned result will be an array that contains all duplicated property keys. Each of these property keys is represented by an object which has the following attributes:

|Attribute|Description|
|:--|:--|
|key|The key name of the duplicated property.
|parent|The parent object of a property key.
|occurrence|The number of property keys having the same key and parent object.

Moreover, these objects also contain the following functions for illustrating the actual path to the property key:

|Function|Description|
|:--|:--|
|propertyPath()|Returns a list of property keys, which represents the path to the property key of the current object.
|toString()|Prints the path to the property key. However, since all necessary raw data are also contained by the object, the result objects can also be represented in any other way if desired.

**Note:** When using `find-duplicated-property-keys` as a submodule, you always have to pass a JSON string instead of the file path to a JSON file. 