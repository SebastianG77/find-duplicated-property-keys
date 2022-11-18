# CHANGELOG 

## 1.2.9

### Bugfix
- Downgrade version of dependency `chalk` to 4.1.2, since version 5.1.2 of `chalk` is incompatible with the current state of `find-duplicated-property-keys`.

## 1.2.8

### Minor Changes
- Update several dependencies.
- Adjust .travis.yml to avoid building issues.

## 1.2.7

### Minor Changes
- Update several dependencies.

## 1.2.6

### Minor Changes
- Update several dependencies.

## 1.2.5

### Documentation
- Transform attribute and function lists in README.md into tables to improve readability.

### Minor Changes
- Add test case for testing untested line of code in function `formatKey()` of index.js.
- Use package.json script "prepublishOnly" instead of "build:release" to ensure the code will always be built before publishing to npm.
- Update several devDependencies.

## 1.2.4

### Minor Changes
- Slightly simplify functions in index.js by determining the last index of an array in a more comprehensible way.

## 1.2.3

### Bugfix
- Fix exception when analyzing a JSON file with an array containing an array followed by another value.

### Minor Changes
- Update dependency to jest.

## 1.2.2

### Bugfix
- Publish build to npm correctly.

## 1.2.1

### Documentation
- Describe returned exit code when requesting help text in README.md.
- Add quotes around sample call of `find-duplicated-property-keys` again in README.md.

### Minor Changes
- Explicitly return exit code 0 when requesting help text from command line interface.

## 1.2.0

### New Feature
- Return a proper exit code when executing `find-duplicated-property-keys` from command line interface.

### Documentation
- Describe exit codes that can be returned when executing `find-duplicated-property-keys` from command line interface in README.md.
- Add an additional property to the example in README.md to emphasize only duplicated property keys will be returned.
- Adjust build badge due to migration from https://travis-ci.org/ to https://travis-ci.com/.

### Minor Changes
- Update several devDependencies.

## 1.1.2

### Minor Changes
- Simplify function `formatKey()` in index.js.
- Update several devDependencies.

## 1.1.1

### Minor Changes
- Update several devDependencies.

## 1.1.0

### New Feature
- Display the occurrence for each duplicated key when running `find-duplicated-property-keys` via command line interface.

### Documentation
- Adjust README.md to new feature by explaining the meaning of the additionally printed values briefly.
- Adjust command line interface help to new feature by explaining the meaning of the additionally printed values briefly.

### Minor Changes
- Update several dependencies.

## 1.0.14

### Minor Changes
- Set version of NodeJS in .travis.yml to latest LTS version to ensure all dependencies will be installed when building with Travis CI.

## 1.0.13

### Minor Changes
- Update several devDependencies.

## 1.0.12

### Documentation
- Add code highlighting in README.md.
- Clarify description of function `propertyPath()` in README.md.
- Fix typos in README.md.
- Refactor example for calling function `findDuplicatedPropertyKeys()` programmatically in README.md.

### Minor Changes
- Fix function `toString()`, such that arrays will not be presented like objects anymore but as indices of objects.
- Add additional test cases.
- Update several dependencies.

## 1.0.11

### Documentation
- Add this Changelog.md to get an overview of the improvements made since the last release.
- Add standard code style badge in README.md.
- Adjust keywords in package.json.

### Minor Changes
- Remove dependency to app-root-path since it was only used in test cases and could be replaced by a manually set root directory.
- Adjust code style to StandardJS 14.1.0.
- Update several devDependencies.