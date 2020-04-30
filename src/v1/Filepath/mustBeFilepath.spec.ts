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
import { THROW_THE_ERROR } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { expect } from "chai";
import { describe } from "mocha";
import path from "path";

import { mustBeFilepath } from ".";
import { NotAFilepathError } from "../Errors";
import { invalidPaths, validPosixPaths } from "./testFixtures";

describe("mustBeFilepath()", () => {
    describe("when `base` is `null`", () => {
        for (const inputValue of validPosixPaths) {
            it("accepts valid UNIX location '" + inputValue + "' on POSIX", () => {
                expect(() => mustBeFilepath(null, inputValue, THROW_THE_ERROR, path.posix)).to.not.throw();
            });
        }

        it("accepts valid relative path", () => {
            // this test is designed to work on both platforms,
            // in order to satisfy branch coverage
            const inputValue = "..";
            expect(() => mustBeFilepath(null, inputValue)).to.not.throw();
        });

        for (const inputValue of invalidPaths) {
            it("rejects invalid location '" + inputValue + "' on POSIX", () => {
                expect(() => mustBeFilepath(null, inputValue, THROW_THE_ERROR, path.posix)).to.throw(NotAFilepathError);
            });
        }
    });

    describe("when `base` is NOT `null`", () => {
        it("accepts valid relative locations on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "../alfred/trout";

            expect(() => mustBeFilepath(inputBase, inputLocation, THROW_THE_ERROR, path.posix)).to.not.throw();
        });

        it("accepts valid absolute locations on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "/alfred/trout";

            expect(() => mustBeFilepath(inputBase, inputLocation, THROW_THE_ERROR, path.posix)).to.not.throw();
        });

        it("rejects a non-filepath location on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "https://api.example.org/";

            expect(
                () => mustBeFilepath(inputBase, inputLocation, THROW_THE_ERROR, path.posix),
            ).to.throw(NotAFilepathError);
        });
    });
});
