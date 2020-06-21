# CHANGELOG 

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