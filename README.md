# Data Locations for Typescript

## Introduction

This TypeScript library provides safe types for filepaths and remote data locations.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Concepts](#concepts)
- [v1 API](#v1-api)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)

## Quick Start

```
# run this from your Terminal
npm install @ganbarodigital/ts-lib-data-locations
```

```typescript
// add this import to your Typescript code
import { Filepath } from "@ganbarodigital/ts-lib-data-locations/lib/v1"
```

__VS Code users:__ once you've added a single import anywhere in your project, you'll then be able to auto-import anything else that this library exports.

## Concepts

Modern spec and schema files (such as OpenAPI Spec v3 and JSON Schema) allow you say "this piece of data can be found over here", where "over here" might mean:

* elsewhere in the same file
* in a completely different file
* in a remote file

We can all each of these a `DataLocation`, and build some safe types to support them.

Each `DataLocation` is built from:

- a `base`, and
- a `location`

The `base` is where we currently are, and the `location` is where we want to go to. When we combine those together, we end up with the full path to our data, no matter where it is.

## v1 API


## NPM Scripts

### npm run clean

Use `npm run clean` to delete all of the compiled code.

### npm run build

Use `npm run build` to compile the Typescript into plain Javascript. The compiled code is placed into the `lib/` folder.

`npm run build` does not compile the unit test code.

### npm run test

Use `npm run test` to compile and run the unit tests. The compiled code is placed into the `lib/` folder.

### npm run cover

Use `npm run cover` to compile the unit tests, run them, and see code coverage metrics.

Metrics are written to the terminal, and are also published as HTML into the `coverage/` folder.