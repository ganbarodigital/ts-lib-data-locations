# Data Locations for Typescript

## Introduction

This TypeScript library provides safe types for filepaths and remote data locations.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Concepts](#concepts)
- [v1 API](#v1-api)
  - [DataLocation class](#datalocation-class)
  - [isFilepath()](#isfilepath)
  - [mustBeFilepath()](#mustbefilepath)
  - [resolveFilepath()](#resolvefilepath)
  - [NotAFilepathError](#notafilepatherror)
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

Why do we have both?

Imagine that the `base` is the JSON schema file we're looking at, and `location` points at one of the definitions in that schema file. If the definition uses `$ref:` to refer us to another definition in the same file, we'll create a second `DataLocation` to point at the other definition. That second `DataLocation` will still have the same `base` (because we're still inside the same schema file), but a different `location` (because we're pointing at a different definition).

That's a long-winded way of saying that it's normally very helpful to keep track of the `base` as we work our way through a spec, schema file, or indeed, even just a set of folders on a filesystem.

## v1 API

### DataLocation class

```typescript
/**
 * value type.
 *
 * Represents the location of a piece of data. This can be:
 *
 * - a file on a filesystem (a Filepath)
 * - a URL (a URL)
 */
export class DataLocation {
    /**
     * our `base` - where we are.
     *
     * examples:
     * - the root directory of a project
     * - the URL of a JSON schema file
     *
     * the `base` is normally copied into new objects created from this
     * DataLocation
     *
     * set `base` to `null` if you don't know (or don't care) where this
     * DataLocation exists
     */
    public readonly base: string|null;
    public readonly location: string;

    protected constructor(
        base: DataLocation|string|null,
        location: DataLocation|string
    );
}
```

`DataLocation` is a _value type_. It's the base class to use for all location-type classes.

### isFilepath()

```typescript
// how to import into your own code
import { isFilepath } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * data guard.
 *
 * do `base` and `location` combine to (possibly) be a location on a
 * filesystem?
 *
 * we don't check whether the path exists, or even that it's a valid path
 * for the filesystem it would map onto ... merely that it *could* be a
 * credible path
 *
 * @param base
 *        the base folder / file to start from
 * @param location
 *        the (possibly absolute) path to add to `base`
 */
export function isFilepath(base: string|null, location: string, api: PathApi = path): boolean;
```

`isFilepath()` is a _data guard_. Use it to see if a proposed path is (possibly) a filesystem path or not.

Mostly, we check to see if you've passed in a URL instead. Those, we reject.

### mustBeFilepath()

```typescript
// how to import into your own code
import { isFilepath } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

// how to import the types used for parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * data guarantee. throws an error if the given `base` & `location` do not
 * appear to be a filesystem path
 *
 * @param base
 *        the base file/folder to use
 * @param location
 *        the possible path to investigate
 * @param onError
 *        your error handler
 */
export function mustBeFilepath(
    base: string|null,
    location: string,
    onError: OnError = THROW_THE_ERROR,
    api: PathApi = path,
): void;
```

`mustBeFilepath()` is a _data guarantee_. Use it to enforce the `isFilepath()` constraint in your code.

### resolveFilepath()

```typescript
// how to import into your own code
import { resolveFilepath } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * combine a (possibly empty) base path with the given location
 *
 * @param base
 *        the base folder / file to start from
 * @param location
 *        the (possibly absolute) path to add to `base`
 */
export function resolveFilepath(base: string|null, location: string, api: PathApi = path): string
```

`resolveFilepath` is a _data transform_. It combines a (possibly empty) base path with the given location path, by calling `path.resolve()`.

It does *not* check that the path is valid, or that it exists at all.

### NotAFilepathError

```typescript
// how to import it into your own code
import { NotAFilepathError } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

// used for the parameters
export interface NotAFilepathExtraData {
    public: {
        base: string | null;
        location: string;
    };
}

export class NotAFilepathError extends AppError
{
    public constructor(params: NotAFilepathExtraData | AppErrorParams);
}
```

`NotAFilepathError` is a throwable `Error`. Use it to report a data location that isn't a well-formed file path.

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