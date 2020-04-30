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
import path from "path";

import { PathApi } from ".";

export const validPosixPaths = [
    "/root",
];

export const invalidPaths = [
    "https://api.example.com",
];

type paramTypes = string|string[]|path.ParsedPath|null;

export class DummyPathApi implements PathApi {
    public calledList: string[];
    public paramList: paramTypes[];
    public basenameResponses: string[];
    public dirnameResponses: string[];
    public extnameResponses: string[];
    public formatResponses: string[];
    public isAbsoluteResponses: boolean[];
    public joinResponses: string[];
    public normalizeResponses: string[];
    public parseResponses: path.ParsedPath[];
    public relativeResponses: string[];
    public resolveResponses: string[];
    public toNamespacedPathResponses: string[];

    // deliberately choosing silly values here,
    // so that they show up in our test results
    public delimiter = "!";
    public sep = "%";

    public constructor() {
        this.calledList = [];
        this.paramList = [];

        this.basenameResponses = [""];
        this.dirnameResponses = [""];
        this.extnameResponses = [""];
        this.formatResponses = [""];
        this.isAbsoluteResponses = [true];
        this.joinResponses = [""];
        this.normalizeResponses = [""];
        this.parseResponses = [{
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: "",
        }];
        this.relativeResponses = [""];
        this.resolveResponses = [""];
        this.toNamespacedPathResponses = [""];
    }

    public reset() {
        this.calledList = [];
        this.paramList = [];

        this.basenameResponses = [""];
        this.dirnameResponses = [""];
        this.extnameResponses = [""];
        this.formatResponses = [""];
        this.isAbsoluteResponses = [true];
        this.joinResponses = [""];
        this.normalizeResponses = [""];
        this.parseResponses = [{
            root: "",
            dir: "",
            base: "",
            ext: "",
            name: "",
        }];
        this.relativeResponses = [""];
        this.resolveResponses = [""];
        this.toNamespacedPathResponses = [""];
    }

    public basename(input: string, ext?: string): string {
        this.calledList.push("basename()");
        this.paramList.push(input);
        this.paramList.push(ext || null);

        return this.basenameResponses.shift() as string;
    }

    public dirname(input: string): string {
        this.calledList.push("dirname()");
        this.paramList.push(input);

        return this.dirnameResponses.shift() as string;
    }

    public extname(input: string): string {
        this.calledList.push("extname()");
        this.paramList.push(input);

        return this.extnameResponses.shift() as string;
    }

    public format(pathObject: path.ParsedPath): string {
        this.calledList.push("format()");
        this.paramList.push(pathObject);

        return this.formatResponses.shift() as string;
    }

    public isAbsolute(input: string): boolean {
        this.calledList.push("isAbsolute()");
        this.paramList.push(input);

        return this.isAbsoluteResponses.shift() as boolean;
    }

    public join(...paths: string[]): string {
        this.calledList.push("join()");
        this.paramList.push(paths);

        return this.joinResponses.shift() as string;
    }

    public normalize(input: string): string {
        this.calledList.push("normalize()");
        this.paramList.push(input);

        return this.normalizeResponses.shift() as string;
    }

    public parse(input: string): path.ParsedPath {
        this.calledList.push("parse()");
        this.paramList.push(input);

        return this.parseResponses.shift() as path.ParsedPath;
    }

    public relative(from: string, to: string): string {
        this.calledList.push("relative()");
        this.paramList.push(from);
        this.paramList.push(to);

        return this.relativeResponses.shift() as string;
    }

    public resolve(...paths: string[]): string {
        this.calledList.push("resolve()");
        this.paramList.push(paths);

        return this.resolveResponses.shift() as string;
    }

    public toNamespacedPath(input: string): string {
        this.calledList.push("toNamespacedPath()");
        this.paramList.push(input);

        return this.toNamespacedPathResponses.shift() as string;
    }
}