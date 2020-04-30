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
import { expect } from "chai";
import { describe } from "mocha";

import { isFilepath } from ".";
import { invalidPaths, validPosixPaths } from "./testFixtures";

describe("isFilepath()", () => {
    describe("when `base` is `null`", () => {
        for (const inputValue of validPosixPaths) {
            it("accepts valid UNIX location '" + inputValue + "' on POSIX", () => {
                const expectedValue = true;
                const actualValue = isFilepath(null, inputValue);

                expect(actualValue).to.equal(expectedValue);
            });
        }

        for (const inputValue of invalidPaths) {
            it("rejects invalid location '" + inputValue + "' on POSIX", () => {
                const expectedValue = false;
                const actualValue = isFilepath(null, inputValue);

                expect(actualValue).to.equal(expectedValue);
            });
        }
    });

    describe("when `base` is NOT `null`", () => {
        it("accepts valid relative locations on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "../alfred/trout";
            const expectedValue = true;
            const actualValue = isFilepath(inputBase, inputLocation);

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts valid absolute locations on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "/alfred/trout";
            const expectedValue = true;
            const actualValue = isFilepath(inputBase, inputLocation);

            expect(actualValue).to.equal(expectedValue);
        });

        it("rejects a non-filepath base on POSIX", () => {
            const inputBase = "https://api.example.org/";
            const inputLocation = "/tmp/example";
            const expectedValue = false;
            const actualValue = isFilepath(inputBase, inputLocation);

            expect(actualValue).to.equal(expectedValue);
        });

        it("rejects a non-filepath location on POSIX", () => {
            const inputBase = "/tmp/example";
            const inputLocation = "https://api.example.org/";
            const expectedValue = false;
            const actualValue = isFilepath(inputBase, inputLocation);

            expect(actualValue).to.equal(expectedValue);
        });
    });
});
