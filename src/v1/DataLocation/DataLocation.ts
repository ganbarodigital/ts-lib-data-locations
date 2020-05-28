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

import { addExtension, implementsProtocol, ProtocolDefinition } from "@ganbarodigital/ts-lib-augmentations/lib/v1";
import { Value } from "@ganbarodigital/ts-lib-value-objects/lib/v2";

export interface DataLocationConstructor {
    // tslint:disable-next-line: callable-types
    new (base: string|null, location: string): DataLocation;
}

/**
 * value type.
 *
 * Represents the location of a piece of data. This can be:
 *
 * - a file on a filesystem (a Filepath)
 * - a URL (a URL)
 */
export abstract class DataLocation implements Value<string> {
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
    #base: string|null;

    /**
     * this can be:
     *
     * - a relative path (to be applied to the `base`)
     * - an absolute path (to override the `base`)
     *
     * the `location` is always replaced when new objects are created from
     * this DataLocation
     */
    #location: string;

    /**
     * call this from your child class
     *
     * @param {(string|null)} base
     * @param {string} location
     * @memberof DataLocation
     */
    protected constructor(base: DataLocation|string|null, location: DataLocation|string) {
        if (base instanceof DataLocation) {
            this.#base = base.valueOf();
        } else {
            this.#base = base;
        }

        if (location instanceof DataLocation) {
            this.#location = location.valueOf();
        } else {
            this.#location = location;
        }
    }

    /**
     * returns the `base` parameter passed into the constructor
     *
     * @readonly
     * @type {(string|null)}
     * @memberof DataLocation
     */
    get base(): string|null {
        return this.#base;
    }

    /**
     * returns the `location` parameter passed into the constructor
     *
     * @readonly
     * @type {string}
     * @memberof DataLocation
     */
    get location(): string {
        return this.#location;
    }

    /**
     * adds an additional feature to the DataLocation data type
     *
     * @template S
     * @param {S} source
     * @param {S} [seed]
     * @returns {(DataLocation & S)}
     * @memberof DataLocation
     */
    public addExtension<S>(source: S, seed?: S): this & S {
        return addExtension(this, source, seed);
    }

    /**
     * type guard. Returns `true` if:
     *
     * - this DataLocation implements the required methods, or
     * - someone has added a suitable extension to this DataLocation
     *
     * that satisfy the given protocol definition.
     */
    public implementsProtocol<T>(protocol: ProtocolDefinition): this is T {
        return implementsProtocol<T>(this, protocol);
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
     * returns the resolved DataLocation
     */
    public abstract valueOf(): string;

    /**
     * auto-conversion support
     */
    public [Symbol.toPrimitive](hint: string): string|null {
        if (hint === "number") {
            return null;
        }
        return this.valueOf();
    }
}