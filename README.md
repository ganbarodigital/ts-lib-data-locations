# Data Locations for Typescript

## Introduction

This TypeScript library provides safe types for filepaths and remote data locations.

- [Introduction](#introduction)
- [Quick Start](#quick-start)
- [Concepts](#concepts)
- [DataLocation](#datalocation)
  - [DataLocation class](#datalocation-class)
- [Filepaths](#filepaths)
  - [isFilepath()](#isfilepath)
  - [mustBeFilepath()](#mustbefilepath)
  - [resolveFilepath()](#resolvefilepath)
  - [Filepath Class](#filepath-class)
  - [NotAFilepathError Class](#notafilepatherror-class)
- [IpPort](#ipport)
  - [IpPort Value Type](#ipport-value-type)
  - [formatIpPortAsNumber()](#formatipportasnumber)
  - [formatIpPortAsString()](#formatipportasstring)
- [URLs](#urls)
  - [URL Value Type](#url-value-type)
  - [buildURLHref()](#buildurlhref)
  - [URLFormatOptions](#urlformatoptions)
  - [URLFormatOptionsWithHostname](#urlformatoptionswithhostname)
  - [PRURLFormatOptions](#prurlformatoptions)
  - [URLFormatOptionsWithPathname](#urlformatoptionswithpathname)
  - [URLFormatOptionsWithSearch](#urlformatoptionswithsearch)
  - [URLFormatOptionsWithHash](#urlformatoptionswithhash)
  - [isPRURLFormatOptions()](#isprurlformatoptions)
  - [isURLFormatOptionsWithHostname()](#isurlformatoptionswithhostname)
  - [isURLHash()](#isurlhash)
  - [isURLSearch()](#isurlsearch)
  - [ParsedURL](#parsedurl)
- [NPM Scripts](#npm-scripts)
  - [npm run clean](#npm-run-clean)
  - [npm run build](#npm-run-build)
  - [npm run test](#npm-run-test)
  - [npm run cover](#npm-run-cover)
  - [References](#references)

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

## DataLocation

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

## Filepaths

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

### Filepath Class

```typescript
// how to import into your own code
import { Filepath } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

// how to import types used as parameters
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";

/**
 * value type.
 *
 * Represents a path to a file, folder or other entry in a filesystem.
 * The thing it points at does not have to exist, and isn't guaranteed
 * to be legal for the filesystem in question.
 */
export class Filepath extends DataLocation implements Value<string> {
    #pathApi: PathApi;
    #path: string;
    #parts: path.ParsedPath | undefined;

    public static format(
        base: Filepath|string|null,
        parts: path.ParsedPath,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path
    ): Filepath;

    public static fromBase(
        base: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    ): Filepath;

    public static fromLocation(
        location: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    ): Filepath;

    public static from(
        base: Filepath|string|null,
        offset: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path
    ): Filepath;

    protected constructor(
        base: Filepath|string|null,
        location: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    );

    get pathApi(): PathApi {
        return this.#pathApi;
    }

    // =======================================================================
    //
    // VALUE functions
    //
    // -----------------------------------------------------------------------

    /**
     * type guard. Proves to the TS compiler what we are.
     */
    public isValue(): this is Value<string>;

    /**
     * returns the resolved path
     */
    public valueOf(): string;

    /**
     * auto-conversion support
     */
    public [Symbol.toPrimitive](hint: string): string|null;

    // =======================================================================
    //
    // PATH API functions
    //
    // -----------------------------------------------------------------------

    /**
     * get the final part of the path
     *
     * if `ext` is supplied, we strip that off for you
     */
    public basename(ext?: string): string;

    /**
     * get the parent of this path
     *
     * the returned Filepath will have the same `base` path that
     * this Filepath does
     */
    public dirname(onError: OnError = THROW_THE_ERROR): Filepath;

    /**
     * get the file extension (if there is one)
     */
    public extname(): string;

    /**
     * returns `true` if this Filepath contains an absolute path
     * (ie a path that starts from the root folder)
     */
    public isAbsolute(): boolean;

    /**
     * appends the given paths to this path
     *
     * the returned Filepath will have the same `base` path that
     * this Filepath does
     */
    public join(...paths: string[]): Filepath;

    /**
     * breaks down the structure of this path
     */
    public parse(): path.ParsedPath;

    /**
     * calculate the relative path between two Filepaths
     */
    public relative(to: Filepath): string;

    /**
     * calculate a new Filepath, by combining this Filepath with the
     * given `paths`
     *
     * the returned Filepath will have this Filepath as its base;
     * ie it will get a new base path.
     */
    public resolve(...paths: string[]): Filepath;

    /**
     * converts this path into a Microsoft namespaced path, if you're
     * running on Win32.
     *
     * On Linux, it's a no-op, and it just returns the current Filepath
     * as a string (exactly like .valueOf() does).
     */
    public toNamespacedPath(): string;
}
```

`Filepath` is a _value type_. It represents a path to something on a filesystem, with an optional "base" location.

It provides a number of static constructors:

* `Filepath.format()` - when you want to create a `Filepath` from a previously-parsed file path.
* `Filepath.fromBase()` - when you're creating a `Filepath` to represent the "base" location that you want to track.
* `Filepath.fromLocation()` - when you don't care about tracking the "base" location.
* `Filepath.from()` - the most generic constructor.

For convenience, it provides methods that give you all of the standard functionality from NodeJS's `path` module. Many of these menthods create new `Filepath` objects, to help you stay safely typed.

### NotAFilepathError Class

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

## IpPort

### IpPort Value Type

```typescript
/**
 * value type
 *
 * represents the port number of an IP address.
 */
export type IpPort = string|number;
```

### formatIpPortAsNumber()

```typescript
// how to import
import { formatIpPortAsNumber, IpPort } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * convert an IpPort interface to be an integer number
 */
export function formatIpPortAsNumber(port: IpPort): number;
```

### formatIpPortAsString()

```typescript
/**
 * convert an IpPort interface to be a valid string
 */
export function formatIpPortAsString(port: IpPort): string;
```

## URLs

### URL Value Type

```typescript
// how to import
import { URL } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

// the types we use for parameters
import { ParsedURL } from "@ganbarodigital/ts-lib-data-locations/lib/v1";
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { Value } from "@ganbarodigital/ts-lib-value-objects/lib/v2";
import url from "url";

/**
 * value type. Represents a URL that is built from (up to) two parts:
 *
 * - a base URL (such as a page, or the root document of an API / Schema spec)
 * - a location URL (such as a reference to an ID on that page / spec)
 *
 * We also implement (most of) the WHATWG spec for a URL (as done by NodeJS
 * and modern browsers), to make this class immediately familiar.
 *
 * The main things NOT IMPLEMENTED are:
 *
 * - any setters (this is an immutable value), and
 * - support for usernames / passwords in URLs (deprecated by RFC 3986)
 */
export class URL extends DataLocation implements Value<string> {
    /**
     * static constructor. Assembles a URL from an optional baseUrl,
     * and a set of parts.
     */
    public static format(
        base: string|null|URL|url.URL,
        parts: URLFormatOptions,
        onError: OnError = THROW_THE_ERROR
    ): URL;

    /**
     * static constructor. Assembles a URL value from the given base URL.
     */
    public static fromBase(
        base: string|URL|url.URL,
        onError: OnError = THROW_THE_ERROR
    );

    /**
     * static constructor. Assembles a URL value from the given URL.
     */
    public static fromLocation(
        location: string|URL|url.URL,
        onError: OnError = THROW_THE_ERROR
    ): URL;

    /**
     * static constructor. Assembles a URL from an optional baseURL,
     * and a (possibly relative) URL.
     */
    public static from(
        base: string|null|URL|url.URL,
        location: string|URL|url.URL,
        onError: OnError = THROW_THE_ERROR
    ): URL;

    /**
     * smart constructor
     */
    protected constructor(
        base: string|null,
        location: string,
        onError: OnError = THROW_THE_ERROR
    );

    // =======================================================================
    //
    // VALUE functions
    //
    // -----------------------------------------------------------------------

    /**
     * type guard. Proves to the TS compiler what we are.
     */
    public isValue(): this is Value<string>;

    /**
     * returns the resolved path
     */
    public valueOf(): string;

    /**
     * auto-conversion support
     */
    public [Symbol.toPrimitive](hint: string): string|null;

    // =======================================================================
    //
    // urlApi FUNCTIONS
    //
    // -----------------------------------------------------------------------

    /**
     * returns the #fragment section of this URL
     */
    get hash(): string;

    /**
     * returns the '<hostname>:<port>' section of this URL
     */
    get host(): string;

    /**
     * returns the hostname section of this URL
     */
    get hostname(): string;

    /**
     * returns the full URL as a string
     */
    get href(): string;

    /**
     * returns the '<protocol>://<hostname>:<port>' section of this URL
     */
    get origin(): string;

    /**
     * returns the query path section of this URL
     */
    get pathname(): string;

    /**
     * returns the port number that this URL specifies
     *
     * if the URL doesn't contain a port, OR if the URL uses the default
     * port for the URL's <protocol>, this returns an empty string
     */
    get port(): string;

    /**
     * returns the protocol specified in this URL
     */
    get protocol(): string;

    /**
     * returns the query string section of this URL.
     *
     * The return value starts with a '?'
     *
     * If the URL does not have a query string section, we return an empty
     * string.
     */
    get search(): string;

    /**
     * returns a list of this URL's query string keys and values
     */
    get searchParams(): url.URLSearchParams;

    /**
     * returns the URL as a ready-to-use string
     */
    public toString(): string;

    /**
     * returns the URL as a string to use in JSON serialization.
     *
     * NOTE that this (just like the NodeJS URL.toJSON()) does *not*
     * return a valid JSON string. I've zero idea why the original API
     * behaves this way.
     */
    public toJSON(): string;

    // =======================================================================
    //
    // (PARTIAL) PATH FUNCTIONS
    //
    // -----------------------------------------------------------------------

    /**
     * get the parent of this path
     *
     * the returned URL will have:
     *
     * - the same `base` as this URL
     * - any `search` parameters removed
     * - any `hash` fragment removed
     */
    public dirname(onError: OnError = THROW_THE_ERROR): URL;

    /**
     * builds a new URL by appending the given parts to this URL
     *
     * the returned URL will have the same `base` path that
     * this URL does
     *
     * we apply the parts in the order you give them. Change something
     * earlier in the URL structure, and we drop everything that comes
     * after it:
     *
     * - a new URL completely replaces anything earlier in the params
     * - a path change forces us to drop `search` and `hash` segments
     * - a ?search change forces us to drop the `#hash` segment
     * - a #hash change doesn't change anything else in the response
     *
     * the only way to change the protocol or hostname is to pass in a
     * new URL as a string.
     */
    public join(...urlsOrParts: string[]): URL;

    /**
     * breaks down the structure of this URL
     */
    public parse(): ParsedURL;

    /**
     * builds a new URL by appending the given parts to this URL
     *
     * the returned URL will have the new URL as its `base`
     *
     * we apply the parts in the order you give them. Change something
     * earlier in the URL structure, and we drop everything that comes
     * after it:
     *
     * - a new URL completely replaces anything earlier in the params
     * - a path change forces us to drop `search` and `hash` segments
     * - a ?search change forces us to drop the `#hash` segment
     * - a #hash change doesn't change anything else in the response
     *
     * the only way to change the protocol or hostname is to pass in a
     * new URL as a string.
     */
    public resolve(...urlsOrParts: string[]): URL;
}
```

`URL` is a _value type_. It represents a URL - an address to a resource on the web.

There's a few notable differences between this and NodeJS's built-in `URL`:

* we use static constructors, instead of `new`
* we keep track of the `base url` used to build the value object
* ours is immutable

### buildURLHref()

```typescript
// how to import
import { buildURLHref } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * assembles a URL string from a list of given parts
 */
export function buildURLHref(parts: URLFormatOptions): string;
```

`buildURLHref()` converts a list of URL constituent parts into a single URL string.

### URLFormatOptions

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification
 */
export type URLFormatOptions =
    URLFormatOptionsWithHostname
    | PRURLFormatOptions
    | URLFormatOptionsWithPathname
    | URLFormatOptionsWithSearch
    | URLFormatOptionsWithHash;
```

`URLFormatOptions` is an intersection type. It represents the individual parts of a URL that you want to build.

```typescript
// how to import it
import { buildURLHref, URLFormatOptions } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

// ALWAYS use the type 'URLFormatOptions' when building your list of
// URL parts, for maximum future compatibility
const parts: URLFormatOptions = {
    hostname: "www.example.com",
};

const href = buildURLHref(parts);
```

`URLFormatOptions` is made from _dumb value types_. Each of these types represents a single, valid state. If we've built this right, it should be impossible for you to create a list of URL parts where the list doesn't contain the parts needed to assemble a URL.

There's no verification, so there's nothing to stop you making a list that contains invalid values for different parts. That's a different problem :)

#### No Authentication Support

Although the WHATWG specification (which browsers and NodeJS use) includes support for passing usernames and passwords in URLs, we've decided **not** to support those fields.

These fields are deprecated by [RFC 3986][RFC 3986], and many browsers have dropped support for these fields.

### URLFormatOptionsWithHostname

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification.
 *
 * this interface is built for URLs that definitely contain a hostname
 */
export interface URLFormatOptionsWithHostname {
    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol?: string;

    /**
     * the server where the remote data is hosted
     */
    hostname: string;

    /**
     * the port number to connect to on the remote hostname
     */
    port?: IpPort;

    /**
     * the query path portion of the URL
     */
    pathname?: string;

    /**
     * the #fragment section of the URL
     */
    hash?: string;

    /**
     * the query string portion of the URL
     */
    search?: string;
}
```

`URLFormatOptionsWithHostname` is a _dumb value type_. It represents

### PRURLFormatOptions

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * this interface is built for URLs that take advantage of a feature called
 * 'protocol-relative'.
 */
export interface PRURLFormatOptions {
    /**
     * set to `true` if you want a protocol-relative URL to be generated
     *
     * set to `false` if you don't want a protocol specified at the front
     * of this URL
     */
    protocolRelative: boolean;

    /**
     * the server where the remote data is hosted
     */
    hostname: string;

    /**
     * the port number to connect to on the remote hostname
     */
    port?: string|number;

    /**
     * the query path portion of the URL
     */
    pathname?: string;

    /**
     * the query string portion of the URL
     */
    search?: string;

    /**
     * the #fragment section of the URL
     */
    hash?: string;
}
```

### URLFormatOptionsWithPathname

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * this interface is built for relative URLs that contain a query path
 * of some kind
 */
export interface URLFormatOptionsWithPathname {
    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol?: string;

    /**
     * the query path portion of the URL
     */
    pathname: string;

    /**
     * the query string portion of the URL
     */
    search?: string;

    /**
     * the #fragment section of the URL
     */
    hash?: string;
}
```

### URLFormatOptionsWithSearch

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * this interface is built for relative URLs that contain a query string
 * of some kind
 */
export interface URLFormatOptionsWithSearch {
    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol?: string;

    /**
     * the query path portion of the URL
     */
    pathname?: string;

    /**
     * the query string portion of the URL
     */
    search: string;

    /**
     * the #fragment section of the URL
     */
    hash: string;
}
```

### URLFormatOptionsWithHash

```typescript
/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * this interface is built for URLs that contain a 'fragment' of some kind,
 * called the 'hash' in the WHATWG specification
 */
export interface URLFormatOptionsWithHash {
    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol?: string;

    /**
     * the query path portion of the URL
     */
    pathname?: string;

    /**
     * the query string portion of the URL
     */
    search?: string;

    /**
     * the #fragment section of the URL
     */
    hash: string;
}
```

### isPRURLFormatOptions()

```typescript
// how to import
import {
    isPRURLFormatOptions,
    URLFormatOptions
} from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * type guard. Returns `true` if `input` is a `PRURLFormatOptions` type
 */
export function isPRURLFormatOptions(input: URLFormatOptions): input is PRURLFormatOptions;
```

`isPRURLFormatOptions()` is a _type guard_. Use it to tell what sub-type of `URLFormatOptions` you have been given.

### isURLFormatOptionsWithHostname()

```typescript
// how to import
import {
    isURLFormatOptionsWithHostname,
    URLFormatOptions
} from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * type guard. Returns `true` if `input` is the sub-type that
 * contains a hostname
 */
export function isURLFormatOptionsWithHostname(
    input: URLFormatOptions
): input is URLFormatOptionsWithHostname;
```

`isURLFormatOptionsWithHostname()` is a _type guard_. Use it to tell what sub-type of `URLFormatOptions` you have been given.

### isURLHash()

```typescript
// how to import into your own code
import { isURLHash } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * data guard. Is the given input a URL hash (aka a fragment)?
 *
 * the entire input must have the structure of a URL hash,
 * for it to match
 */
export function isURLHash(input: string): boolean;
```

### isURLSearch()

```typescript
// how to import into your own code
import { isURLSearch } from "@ganbarodigital/ts-lib-data-locations/lib/v1";

/**
 * data guard. Is the given input a URL search term?
 *
 * the entire input must have the structure of a URL search term,
 * for it to match
 */
export function isURLSearch(input: string): boolean;
```

### ParsedURL

```typescript
import url from "url";

/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * NOTE that we do *NOT* support the `username` and `password` fields.
 * These are deprecated by RFC 3986, and may not be supported by your
 * choice of browser AND/OR your destination.
 *
 * NOTE that we do *NOT support protocol-relative URLs here, because
 * the underlying NodeJS URL doesn't support them
 */
export interface ParsedURL {
    [key: string]: string|URLSearchParams|undefined;

    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol: string;

    /**
     * the server where the remote data is hosted
     */
    hostname: string;

    /**
     * the port number to connect to on the remote hostname
     */
    port?: string;

    /**
     * the query path portion of the URL
     */
    pathname: string;

    /**
     * the query string portion of the URL
     */
    search?: string;

    /**
     * the query string portion of the URL, as a data bag
     */
    searchParams?: url.URLSearchParams;

    /**
     * the #fragment section of the URL
     */
    hash?: string;
}
```

`ParsedURL` is a _value object_. It contains a breakdown of the parts that make up a [`URL`](#url-value-type). It's used as the return type from `URL.parse()`.

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

### References

[RFC 3986]: https://tools.ietf.org/html/rfc3986