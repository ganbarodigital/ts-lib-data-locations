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
import { Value } from "@ganbarodigital/ts-lib-value-objects/lib/v2";
import path from "path";

import { DataLocation } from "../DataLocation";
import { mustBeFilepath } from "./mustBeFilepath";
import { PathApi } from "./PathApi";
import { resolveFilepath } from "./resolveFilepath";

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
    ): Filepath {
        return new Filepath(
            base,
            pathApi.format(parts),
            onError,
            pathApi,
        );
    }

    public static fromBase(
        base: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    ): Filepath {
        return new Filepath(null, base, onError, pathApi);
    }

    public static fromLocation(
        location: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    ): Filepath {
        return new Filepath(null, location, onError, pathApi);
    }

    public static from(
        base: Filepath|string|null,
        offset: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path
    ): Filepath {
        return new Filepath(base, offset, onError, pathApi);
    }

    protected constructor(
        base: Filepath|string|null,
        location: Filepath|string,
        onError: OnError = THROW_THE_ERROR,
        pathApi: PathApi = path,
    ) {
        // keep the parents happy
        super(base, location);

        // robustness!
        mustBeFilepath(this.base, this.location, onError);

        // remember the API we're going to use for all of our operations
        this.#pathApi = pathApi;

        // calculate the actual path ONCE
        this.#path = pathApi.normalize(resolveFilepath(this.base, this.location, pathApi));
    }

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
    public isValue(): this is Value<string> {
        return true;
    }

    /**
     * returns the resolved path
     */
    public valueOf(): string {
        return this.#path;
    }

    /**
     * auto-conversion support
     */
    public [Symbol.toPrimitive](hint: string): string|null {
        if (hint === "number") {
            return null;
        }
        return this.#path;
    }

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
    public basename(ext?: string): string {
        return this.#pathApi.basename(this.#path, ext);
    }

    /**
     * get the parent of this path
     *
     * the returned Filepath will have the same `base` path that
     * this Filepath does
     */
    public dirname(onError: OnError = THROW_THE_ERROR): Filepath {
        return new Filepath(
            this.base,
            this.#pathApi.dirname(this.#path),
            onError,
            this.#pathApi,
        );
    }

    /**
     * get the file extension (if there is one)
     */
    public extname(): string {
        return this.#pathApi.extname(this.#path);
    }

    /**
     * returns `true` if this Filepath contains an absolute path
     * (ie a path that starts from the root folder)
     */
    public isAbsolute(): boolean {
        return this.#pathApi.isAbsolute(this.#path);
    }

    /**
     * appends the given paths to this path
     *
     * the returned Filepath will have the same `base` path that
     * this Filepath does
     */
    public join(...paths: string[]): Filepath {
        return new Filepath(
            this.base,
            this.#pathApi.join(...paths),
            THROW_THE_ERROR,
            this.#pathApi,
        );
    }

    /**
     * breaks down the structure of this path
     */
    public parse(): path.ParsedPath {
        // we calculate it once, and then stash it
        // for repeated reference
        const retval = this.#parts || this.#pathApi.parse(this.#path);
        this.#parts = this.#parts || retval;

        // all done
        return retval;
    }

    /**
     * calculate the relative path between two Filepaths
     */
    public relative(to: Filepath): string {
        return this.#pathApi.relative(this.#path, to.valueOf());
    }

    /**
     * calculate a new Filepath, by combining this Filepath with the
     * given `paths`
     *
     * the returned Filepath will have this Filepath as its base;
     * ie it will get a new base path.
     */
    public resolve(...paths: string[]): Filepath {
        return new Filepath(
            this.#path,
            this.#pathApi.resolve(...paths),
            THROW_THE_ERROR,
            this.#pathApi,
        );
    }

    /**
     * converts this path into a Microsoft namespaced path, if you're
     * running on Win32.
     *
     * On Linux, it's a no-op, and it just returns the current Filepath
     * as a string (exactly like .valueOf() does).
     */
    public toNamespacedPath(): string {
        return this.#pathApi.toNamespacedPath(this.#path);
    }
}
