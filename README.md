# find-duplicated-property-keys

A tool for detecting all duplicated property keys of a JSON file. It can be either be used as a standalone tool for validting JSON files or as a sub module for other node projects.


### Use as a Standlone Tool

If you would like to use it as a standalone tool, it is recommendet to install it globally by using the following command:

```
$ npm install -g find-duplicated-property-keys
```

To run this standalone tool you simply need to execut the tool like this:

```
$ npm start find-duplicated-property-keys -s <path-to-json-file>
```

If the validation succeeded you will get a console message, which lists all duplicated property keys or a notification to indicate the JSON file does not contain any duplicated property keys.


### Use as a Submodule

In case you need to run this module from another project, you first have to add it to your package.json by executing the following command while being in the root directory of your project:

```
$ npm install find-duplicated-property-keys
```

To validate a JSON file you have to run the module as described in the following:

```
const findDuplicatedPropertyKeys = require('find-duplicated-property-keys');

let jsonString = '{"name": "Carl", "name": "Carla"}';

let result = findDuplicatedPropertyKeys(jsonString);

console.log(result.toString()); // <instance>.name
```

The returned result will be an object which contains the following attributes:

- key: The key name of the duplicated property.
- parent: The parent object of a property key.
- occurrence: The number of property keys having this path and this parent object.

Moreover it also contains the following functions:
- propertyPath(): Returns a list of property keys, which reprsent the clocation path to property key.
- toString(): Prints the path of a property key. However, since all necessary raw data are also contained by the object, the result objects can also be represented in any other way.
