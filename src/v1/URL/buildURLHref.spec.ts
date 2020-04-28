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

import { buildURLHref } from ".";
import { URLFormatOptions } from "../URLFormatOptions";

interface UnitTestData {
    description: string;
    inputValue: URLFormatOptions;
    expectedValue: string;
}

describe("buildURLHref()", () => {
    describe("URLs with hostnames", () => {
        const unitTestDataset: UnitTestData[] = [
            {
                description: "accepts an optional 'protocol'",
                inputValue: {
                    protocol: "https",
                    hostname: "example.com",
                },
                expectedValue: "https://example.com"
            },
            {
                description: "accepts a protocol that ends with a ':'",
                inputValue: {
                    protocol: "https:",
                    hostname: "example.com",
                },
                expectedValue: "https://example.com"
            },
            {
                description: "accepts a hostname with no protocol",
                inputValue: {
                    hostname: "example.com",
                },
                expectedValue: "example.com",
            },
            {
                description: "accepts a hostname with a port",
                inputValue: {
                    hostname: "example.com",
                    port: 443
                },
                expectedValue: "example.com:443",
            },
            {
                description: "accepts parts with no path and a hash",
                inputValue: {
                    hostname: "example.com",
                    hash: "id12345",
                },
                expectedValue: "example.com/#id12345"
            },
            {
                description: "accepts a hash that starts with a '#'",
                inputValue: {
                    hostname: "example.com",
                    hash: "#id12345",
                },
                expectedValue: "example.com/#id12345"
            },
            {
                description: "accepts parts with a path and a hash",
                inputValue: {
                    hostname: "example.com",
                    pathname: "/alfred/",
                    hash: "id12345",
                },
                expectedValue: "example.com/alfred/#id12345"
            },
            {
                description: "accepts parts with no path and a search",
                inputValue: {
                    hostname: "example.com",
                    search: "alpha=gamma"
                },
                expectedValue: "example.com/?alpha=gamma"
            },
            {
                description: "accepts a search that starts with a '?'",
                inputValue: {
                    hostname: "example.com",
                    search: "?alpha=gamma"
                },
                expectedValue: "example.com/?alpha=gamma"
            },
            {
                description: "accepts parts with a path and a search",
                inputValue: {
                    hostname: "example.com",
                    pathname: "/alfred/",
                    search: "alpha=gamma"
                },
                expectedValue: "example.com/alfred/?alpha=gamma"
            },
            {
                description: "accepts parts with a path, hash, and a search",
                inputValue: {
                    hostname: "example.com",
                    pathname: "/alfred/",
                    hash: "id12345",
                    search: "alpha=gamma"
                },
                expectedValue: "example.com/alfred/?alpha=gamma#id12345"
            },
        ];

        for (const unitTestData of unitTestDataset) {
            it(unitTestData.description, () => {
                // shorthand
                const inputValue = unitTestData.inputValue;
                const expectedValue = unitTestData.expectedValue;

                const actualValue = buildURLHref(inputValue);
                expect(actualValue).to.equal(expectedValue);
            });
        }
    });

    describe("protocol-relative URLs", () => {
        const unitTestDataset: UnitTestData[] = [
            {
                description: "accepts protocol-relative URLs",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                },
                expectedValue: "//example.com"
            },
            {
                description: "honours 'protocolRelative=false'",
                inputValue: {
                    protocolRelative: false,
                    hostname: "example.com",
                },
                expectedValue: "example.com"
            },
            {
                description: "accepts a hostname with a port",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    port: 443
                },
                expectedValue: "//example.com:443",
            },
            {
                description: "accepts parts with no path and a hash",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    hash: "id12345",
                },
                expectedValue: "//example.com/#id12345"
            },
            {
                description: "accepts parts with a path and a hash",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    pathname: "/alfred/",
                    hash: "id12345",
                },
                expectedValue: "//example.com/alfred/#id12345"
            },
            {
                description: "accepts parts with no path and a search",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    search: "alpha=gamma"
                },
                expectedValue: "//example.com/?alpha=gamma"
            },
            {
                description: "accepts parts with a path and a search",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    pathname: "/alfred/",
                    search: "alpha=gamma"
                },
                expectedValue: "//example.com/alfred/?alpha=gamma"
            },
            {
                description: "accepts parts with a path, hash, and a search",
                inputValue: {
                    protocolRelative: true,
                    hostname: "example.com",
                    pathname: "/alfred/",
                    hash: "id12345",
                    search: "alpha=gamma"
                },
                expectedValue: "//example.com/alfred/?alpha=gamma#id12345"
            },
        ];

        for (const unitTestData of unitTestDataset) {
            it(unitTestData.description, () => {
                // shorthand
                const inputValue = unitTestData.inputValue;
                const expectedValue = unitTestData.expectedValue;

                const actualValue = buildURLHref(inputValue);
                expect(actualValue).to.equal(expectedValue);
            });
        }
    });

    describe("local URLs", () => {
        const unitTestDataset: UnitTestData[] = [
            {
                description: "accepts parts with no path and a hash",
                inputValue: {
                    hash: "id12345",
                },
                expectedValue: "#id12345"
            },
            {
                description: "accepts parts with a path and a hash",
                inputValue: {
                    pathname: "/alfred/",
                    hash: "id12345",
                },
                expectedValue: "/alfred/#id12345"
            },
            {
                description: "accepts parts with no path and a search",
                inputValue: {
                    search: "alpha=gamma"
                },
                expectedValue: "?alpha=gamma"
            },
            {
                description: "accepts parts with a path and a search",
                inputValue: {
                    pathname: "/alfred/",
                    search: "alpha=gamma"
                },
                expectedValue: "/alfred/?alpha=gamma"
            },
            {
                description: "accepts parts with a path, hash, and a search",
                inputValue: {
                    pathname: "/alfred/",
                    hash: "id12345",
                    search: "alpha=gamma"
                },
                expectedValue: "/alfred/?alpha=gamma#id12345"
            },
        ];

        for (const unitTestData of unitTestDataset) {
            it(unitTestData.description, () => {
                // shorthand
                const inputValue = unitTestData.inputValue;
                const expectedValue = unitTestData.expectedValue;

                const actualValue = buildURLHref(inputValue);
                expect(actualValue).to.equal(expectedValue);
            });
        }
    });

    describe("relative URLs", () => {
        const unitTestDataset: UnitTestData[] = [
            {
                description: "accepts parts with no path and a hash",
                inputValue: {
                    hash: "id12345",
                },
                expectedValue: "#id12345"
            },
            {
                description: "accepts parts with a path and a hash",
                inputValue: {
                    pathname: "../alfred/",
                    hash: "id12345",
                },
                expectedValue: "../alfred/#id12345"
            },
            {
                description: "accepts parts with no path and a search",
                inputValue: {
                    search: "alpha=gamma"
                },
                expectedValue: "?alpha=gamma"
            },
            {
                description: "accepts parts with a path and a search",
                inputValue: {
                    pathname: "../alfred/",
                    search: "alpha=gamma"
                },
                expectedValue: "../alfred/?alpha=gamma"
            },
            {
                description: "accepts parts with a path, hash, and a search",
                inputValue: {
                    pathname: "../alfred/",
                    hash: "id12345",
                    search: "alpha=gamma"
                },
                expectedValue: "../alfred/?alpha=gamma#id12345"
            },
        ];

        for (const unitTestData of unitTestDataset) {
            it(unitTestData.description, () => {
                // shorthand
                const inputValue = unitTestData.inputValue;
                const expectedValue = unitTestData.expectedValue;

                const actualValue = buildURLHref(inputValue);
                expect(actualValue).to.equal(expectedValue);
            });
        }
    });
});
