//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
// Redistribution and use in source and binary forms, with or without
// modification, are permitted provided that the following conditions
// are met:
//
//   * Re-distributions of source code must retain the above copyright
//     notice, this list of conditions and the following disclaimer.
//
//   * Redistributions in binary form must reproduce the above copyright
//     notice, this list of conditions and the following disclaimer in
//     the documentation and/or other materials provided with the
//     distribution.
//
//   * Neither the names of the copyright holders nor the names of his
//     contributors may be used to endorse or promote products derived
//     from this software without specific prior written permission.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
// "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
// LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS
// FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE
// COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
// INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
// BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
// LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER
// CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT
// LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN
// ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
// POSSIBILITY OF SUCH DAMAGE.
//
import { OnError, THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import path from "path";
import url from "url";

import { DataLocation } from "../DataLocation";
import { NotAURLError } from "../Errors";
import { ParsedURL } from "../ParsedURL";
import { URLFormatOptions } from "../URLFormatOptions";
import { buildURLHref } from "./buildURLHref";
import { isURL } from "./isURL";
import { isURLHash } from "./isURLHash";
import { isURLSearch } from "./isURLSearch";

/**
 * internal. This is used to help us build the return value from URL.parse()
 */
interface URLOptionalPropMap {
    [key: string]: string;

    port: string;
    search: string;
    hash: string;
}

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
export class URL extends DataLocation {
    #nodeUrl: url.URL;
    #value: string;

    /**
     * static constructor. Assembles a URL from an optional baseUrl,
     * and a set of parts.
     */
    public static format(base: string|null|URL|url.URL, parts: URLFormatOptions, onError: OnError = THROW_THE_ERROR) {
        const location = buildURLHref(parts);

        return URL.from(base, location, onError);
    }

    /**
     * static constructor. Assembles a URL value from the given base URL.
     */
    public static fromBase(base: string|URL|url.URL, onError: OnError = THROW_THE_ERROR) {
        return URL.from(base, "", onError);
    }

    /**
     * static constructor. Assembles a URL value from the given URL.
     */
    public static fromLocation(location: string|URL|url.URL, onError: OnError = THROW_THE_ERROR) {
        return URL.from(null, location, onError);
    }

    /**
     * static constructor. Assembles a URL from an optional baseURL,
     * and a (possibly relative) URL.
     */
    public static from(base: string|null|URL|url.URL, location: string|URL|url.URL, onError: OnError = THROW_THE_ERROR) {
        if (base instanceof url.URL || base instanceof URL) {
            base = base.toString();
        }
        if (location instanceof url.URL || location instanceof URL) {
            location = location.toString();
        }

        return new URL(base, location, onError);
    }

    /**
     * smart constructor
     */
    protected constructor(base: string|null, location: string, onError: OnError = THROW_THE_ERROR) {
        super(base, location);

        try {
            if (base === null) {
                this.#nodeUrl = new url.URL(location);
            } else {
                this.#nodeUrl = new url.URL(location, base);
            }
        }
        catch (e) {
            throw onError(new NotAURLError({public: { base, location }}));
        }

        this.#value = this.#nodeUrl.toString();
    }

    // =======================================================================
    //
    // VALUE functions
    //
    // -----------------------------------------------------------------------

    /**
     * returns the resolved path
     */
    public valueOf(): string {
        return this.#value;
    }

    // =======================================================================
    //
    // urlApi FUNCTIONS
    //
    // -----------------------------------------------------------------------

    /**
     * returns the #fragment section of this URL
     */
    get hash() {
        return this.#nodeUrl.hash;
    }

    /**
     * returns the '<hostname>:<port>' section of this URL
     */
    get host() {
        return this.#nodeUrl.host;
    }

    /**
     * returns the hostname section of this URL
     */
    get hostname() {
        return this.#nodeUrl.hostname;
    }

    /**
     * returns the full URL as a string
     */
    get href() {
        return this.#value;
    }

    /**
     * returns the '<protocol>://<hostname>:<port>' section of this URL
     */
    get origin() {
        return this.#nodeUrl.origin;
    }

    /**
     * returns the query path section of this URL
     */
    get pathname() {
        return this.#nodeUrl.pathname;
    }

    /**
     * returns the port number that this URL specifies
     *
     * if the URL doesn't contain a port, OR if the URL uses the default
     * port for the URL's <protocol>, this returns an empty string
     */
    get port() {
        return this.#nodeUrl.port;
    }

    /**
     * returns the protocol specified in this URL
     */
    get protocol() {
        return this.#nodeUrl.protocol;
    }

    /**
     * returns the query string section of this URL.
     *
     * The return value starts with a '?'
     *
     * If the URL does not have a query string section, we return an empty
     * string.
     */
    get search() {
        return this.#nodeUrl.search;
    }

    /**
     * returns a list of this URL's query string keys and values
     */
    get searchParams(): url.URLSearchParams {
        return this.#nodeUrl.searchParams;
    }

    /**
     * returns the URL as a ready-to-use string
     */
    public toString() {
        return this.#value;
    }

    /**
     * returns the URL as a string to use in JSON serialization.
     *
     * NOTE that this (just like the NodeJS URL.toJSON()) does *not*
     * return a valid JSON string. I've zero idea why the original API
     * behaves this way.
     */
    public toJSON() {
        return this.#nodeUrl.toJSON();
    }

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
    public dirname(onError: OnError = THROW_THE_ERROR): URL {
        const parts = this.parse();
        parts.pathname = path.posix.dirname(parts.pathname);

        // we need to drop these
        parts.search = undefined;
        parts.hash = undefined;

        return URL.format(this.base, parts, onError);
    }

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
    public join(...urlsOrParts: string[]): URL {
        const parts = joinPartsToUrl(this, urlsOrParts);
        return URL.format(this.base, parts);
    }

    /**
     * breaks down the structure of this URL
     */
    public parse(): ParsedURL {
        const retval: ParsedURL = {
            protocol: this.protocol,
            hostname: this.hostname,
            pathname: this.pathname,
        };

        // shorthand
        const propMap: URLOptionalPropMap = {
            port: this.port,
            search: this.search,
            hash: this.hash,
        };

        let propName: string;
        let propValue: string;

        // tslint:disable-next-line: forin
        for (propName in propMap) {
            // shorthand
            propValue = propMap[propName];

            if (propValue.length > 0) {
                retval[propName] = propValue;
            }
        }

        // special cases
        if (retval.search) {
            retval.searchParams = this.searchParams;
        }

        // all done
        return retval;
    }

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
    public resolve(...urlsOrParts: string[]): URL {
        const parts = joinPartsToUrl(this, urlsOrParts);
        const href = buildURLHref(parts);
        return URL.fromBase(href);
    }
}

function joinPartsToUrl(from: URL, urlsOrParts: string[]): ParsedURL {
    // we start with the parts list of our current URL
    //
    // we'll update this as we go
    let parts = from.parse();

    // apply each of the paths we've been given
    //
    // our challenge here is that we might have been given a URL
    // instead of a path
    for (const urlOrPart of urlsOrParts) {
        if (isURL(urlOrPart)) {
            // a full URL replaces our existing URL
            const tmpURL = URL.fromLocation(urlOrPart);
            parts = tmpURL.parse();
        } else if (isURLSearch(urlOrPart)) {
            // a query string replaces any existing query string we have
            parts.search = urlOrPart;

            // drop everything that comes after the search segment
            parts.hash = undefined;
        } else if (isURLHash(urlOrPart)) {
            // a #fragment replaces any existing fragment we have
            parts.hash = urlOrPart;

            // the hash is the last segment of a URL, so we don't
            // need to drop anything else
        } else {
            // a path gets merged into our existing URL's parts
            parts.pathname = path.posix.join(parts.pathname, urlOrPart);

            // drop everything that comes after the pathname segment
            parts.search = undefined;
            parts.hash = undefined;
        }
    }

    // all done
    return parts;
}