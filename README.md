# find-duplicated-property-keys

A tool for detecting all duplicated property keys of a JSON file. It can either be used as a standalone tool for validating JSON files or as a sub module for other node projects.


### Use as a Standlone Tool

If you like to use `find-duplicated-property-keys` as a standalone tool, you first have to install it by using the following command:

```
$ npm install find-duplicated-property-keys
```

To run this tool you simply need to execute it from the install directory like this:

```
$ npm start node_modules/.bin/find-duplicated-property-keys -s <path-to-json-file>
```

Of course, if you prefer a more comfortable way of running this tool, you can also install it globally by using this command:

```
$ npm install -g find-duplicated-property-keys
```

Then you can run `find-duplicated-property-keys` from any directory by using the following command:

```
$ npm start find-duplicated-property-keys -s <path-to-json-file>
```

When running the tool from terminal, it will list all duplicated property keys or return a notification to indicate the JSON file does not contain any duplicated property keys.


### Use as a Submodule

In case you need to include `find-duplicated-property-keys` into another project, you first have to add it to your package.json by executing the following command while being in the root directory of your project:

```
$ npm install find-duplicated-property-keys
```

To validate a JSON string you can run the module as described in the following example:

```
const findDuplicatedPropertyKeys = require('find-duplicated-property-keys');

let jsonString = '{"name": "Carl", "name": "Carla"}';

let result = findDuplicatedPropertyKeys(jsonString);

console.log(result.toString()); // <instance>.name
```

The returned result will be an array that contains all duplicated property keys. Each of these property keys is represented by an object which has the following attributes:

- key: The key name of the duplicated property.
- parent: The parent object of a property key.
- occurrence: The number of property keys having the same key and parent object.

Moreover, these objects also contain the following functions for illustrating the actual path to the property key:

- propertyPath(): Returns a list of property keys, which represents the path to the property key.
- toString(): Prints the path of a property key. However, since all necessary raw data are also contained by the object, the result objects can also be represented in any other way.
