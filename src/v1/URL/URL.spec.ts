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
import { AnyAppError, OnError } from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { expect } from "chai";
import { describe } from "mocha";
import url from "url";

import { URL } from ".";
import { ParsedURL } from "../ParsedURL";
import { URLFormatOptions } from "../URLFormatOptions";

describe("URL value type", () => {
    describe(".format() static constructor", () => {
        it("accepts a string for the base", () => {
            const inputBase = "http://example.com";
            const inputLocation: URLFormatOptions = {
                pathname: "/this/is/an/example"
            }

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.format(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a NodeJS URL for the base", () => {
            const inputBase = new url.URL("http://example.com");
            const inputLocation: URLFormatOptions = {
                pathname: "/this/is/an/example"
            }

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.format(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);

        });

        it("accepts `null` for the base", () => {
            const inputBase = null;
            const inputLocation: URLFormatOptions = {
                protocol: "http",
                hostname: "example.com",
                pathname: "/this/is/an/example",
            }

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.format(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts your own error handler", () => {
            const inputBase = null;
            const inputLocation: URLFormatOptions = {
                pathname: "./relativeUrlsNeedABase"
            }

            const onError: OnError = (err: AnyAppError) => {
                throw new Error("MY ERROR HANDLER!!!");
            }

            expect(() => URL.format(inputBase, inputLocation, onError)).to.throw("MY ERROR HANDLER!!!");
        });

        it("sets the `base` and the `location` properties", () => {
            const inputBase = "http://example.com";
            const inputLocation: URLFormatOptions = {
                pathname: "/this/is/an/example"
            }

            const expectedBase = "http://example.com";
            const expectedLocation = "/this/is/an/example";
            const unit = URL.format(inputBase, inputLocation);
            const actualBase = unit.base;
            const actualLocation = unit.location;

            expect(actualBase).to.equal(expectedBase);
            expect(actualLocation).to.equal(expectedLocation);
        });
    });

    describe(".fromBase() static constructor", () => {
        it("accepts a string", () => {
            const inputBase = "http://example.com/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.fromBase(inputBase).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a NodeJS url", () => {
            const inputBase = new url.URL("http://example.com/this/is/an/example");

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.fromBase(inputBase).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts your own error handler", () => {
            const inputBase = "./relativeUrlsNeedABase";

            const onError: OnError = (err: AnyAppError) => {
                throw new Error("MY ERROR HANDLER!!!");
            }

            expect(() => URL.fromBase(inputBase, onError)).to.throw("MY ERROR HANDLER!!!");
        });

        it("sets the `base` property to be the static constructor parameter", () => {
            const inputBase = "http://example.com";
            const expectedBase = "http://example.com";

            const unit = URL.fromBase(inputBase);
            const actualBase = unit.base;

            expect(actualBase).to.equal(expectedBase);
        });

        it("sets the `location` property to be an empty string", () => {
            const inputBase = "http://example.com";
            const expectedLocation = "";

            const unit = URL.fromBase(inputBase);
            const actualLocation = unit.location;

            expect(actualLocation).to.equal(expectedLocation);
        });
    });

    describe(".fromLocation() static constructor", () => {
        it("accepts a string", () => {
            const inputLocation = "http://example.com/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.fromLocation(inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a NodeJS url", () => {
            const inputLocation = new url.URL("http://example.com/this/is/an/example");

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.fromLocation(inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts your own error handler", () => {
            const inputLocation = "./relativeUrlsNeedABase";

            const onError: OnError = (err: AnyAppError) => {
                throw new Error("MY ERROR HANDLER!!!");
            }

            expect(() => URL.fromLocation(inputLocation, onError)).to.throw("MY ERROR HANDLER!!!");
        });

        it("sets the `base` property to be `null`", () => {
            const inputLocation = "http://example.com";
            const expectedBase = null;

            const unit = URL.fromLocation(inputLocation);
            const actualBase = unit.base;

            expect(actualBase).to.equal(expectedBase);
        });

        it("sets the `location` property to be the static constructor parameter", () => {
            const inputLocation = "http://example.com";
            const expectedLocation = "http://example.com";

            const unit = URL.fromLocation(inputLocation);
            const actualLocation = unit.location;

            expect(actualLocation).to.equal(expectedLocation);
        });
    });

    describe(".from() static constructor", () => {
        it("accepts a string for the base", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a DataLocations URL for the base", () => {
            const inputBase = URL.from("http://example.com", "");
            const inputLocation = "/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a NodeJS URL for the base", () => {
            const inputBase = new url.URL("http://example.com");
            const inputLocation = "/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a `null` as the base", () => {
            const inputBase = null;
            const inputLocation = "http://example.com/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);

        });

        it("accepts a string for the location", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a DataLocations URL for the location", () => {
            const inputBase = null;
            const inputLocation = URL.from(null, "http://example.com/this/is/an/example");

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a NodeJS URL for the location", () => {
            const inputBase = null;
            const inputLocation = new url.URL("http://example.com/this/is/an/example");

            const expectedValue = "http://example.com/this/is/an/example";
            const actualValue = URL.from(inputBase, inputLocation).toString();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts your own error handler", () => {
            const inputLocation = "./relativeUrlsNeedABase";

            const onError: OnError = (err: AnyAppError) => {
                throw new Error("MY ERROR HANDLER!!!");
            }

            expect(() => URL.from(null, inputLocation, onError)).to.throw("MY ERROR HANDLER!!!");
        });
    });

    describe(".isValue() type guard", () => {
        it("returns `true`", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";

            const unit = URL.from(inputBase, inputLocation);

            expect(unit.isValue()).to.equal(true);
        });
    });

    describe(".valueOf()", () => {
        it("returns the URL as a string", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";
            const expectedValue = "http://example.com/this/is/an/example";

            const unit = URL.from(inputBase, inputLocation);

            expect(unit.valueOf()).to.equal(expectedValue);
        });
    });

    describe("auto type-conversions", () => {
        it("auto-converts to a string", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";
            const expectedValue = "this is http://example.com/this/is/an/example";

            const unit = URL.from(inputBase, inputLocation);
            const actualValue = "this is " + unit;

            expect(actualValue).to.equal(expectedValue);
        });

        it("does not auto-convert to a number", () => {
            const inputBase = "http://example.com";
            const inputLocation = "/this/is/an/example";
            const expectedValue = null;

            const unit = URL.from(inputBase, inputLocation);
            const actualValue = unit[Symbol.toPrimitive]("number");

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".hash getter", () => {
        it("returns the #fragment section of the URL", () => {
            const unit = URL.fromLocation("http://example.com#id12345");
            const expectedValue = "#id12345";

            const actualValue = unit.hash;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns an empty string if the URL has no #fragment", () => {
            const unit = URL.fromLocation("http://example.com");
            const expectedValue = "";

            const actualValue = unit.hash;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns an empty string if the URL has an empty #fragment", () => {
            const unit = URL.fromLocation("http://example.com#");
            const expectedValue = "";

            const actualValue = unit.hash;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".host getter", () => {
        it("returns the hostname and port number of the URL", () => {
            const unit = URL.fromLocation("http://example.com:8080");
            const expectedValue = "example.com:8080";

            const actualValue = unit.host;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns only the hostname if the URL has no port number", () => {
            const unit = URL.fromLocation("http://example.com");
            const expectedValue = "example.com";

            const actualValue = unit.host;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns only the hostname if the URL includes the default port number", () => {
            const unit = URL.fromLocation("http://example.com:80");
            const expectedValue = "example.com";

            const actualValue = unit.host;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".hostname getter", () => {
        it("returns the hostname of the URL", () => {
            const unit = URL.fromLocation("http://example.com:8080");
            const expectedValue = "example.com";

            const actualValue = unit.hostname;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".href getter", () => {
        it("returns the URL as a string", () => {
            const unit = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#andFragment");
            const expectedValue = "http://example.com:8080/this/is/a/path?with=search#andFragment";

            const actualValue = unit.href;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".origin getter", () => {
        it("returns the <protocol>://<hostname>:<port> of the URL", () => {
            const unit = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#andFragment");
            const expectedValue = "http://example.com:8080";

            const actualValue = unit.origin;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns the <protocol>://<hostname>/ of the URL, if the URL uses the default port", () => {
            const unit = URL.fromLocation("http://example.com:80/this/is/a/path?with=search#andFragment");
            const expectedValue = "http://example.com";

            const actualValue = unit.origin;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".pathname getter", () => {
        it("returns the query path of the URL", () => {
            const unit = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#andFragment");
            const expectedValue = "/this/is/a/path";

            const actualValue = unit.pathname;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns '/' if the URL has no query path set", () => {
            const unit = URL.fromLocation("http://example.com:8080?with=search#andFragment");
            const expectedValue = "/";

            const actualValue = unit.pathname;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".port getter", () => {
        it("returns the port number from the URL, as a string", () => {
            const unit = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#andFragment");
            const expectedValue = "8080";

            const actualValue = unit.port;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns an empty string, if the URL does not specify a port number", () => {
            const unit = URL.fromLocation("http://example.com/this/is/a/path?with=search#andFragment");
            const expectedValue = "";

            const actualValue = unit.port;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns an empty string, if the URL uses the default port number", () => {
            const unit = URL.fromLocation("http://example.com:80/this/is/a/path?with=search#andFragment");
            const expectedValue = "";

            const actualValue = unit.port;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".protocol getter", () => {
        it("returns the protocol specified in the URL", () => {
            const unit = URL.fromLocation("http://example.com/this/is/a/path?with=search#andFragment");
            const expectedValue = "http:";

            const actualValue = unit.protocol;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns the specified protocol, even if the URL's port number indicates a different protocol", () => {
            const unit = URL.fromLocation("http://example.com:443/this/is/a/path?with=search#andFragment");
            const expectedValue = "http:";

            const actualValue = unit.protocol;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".search getter", () => {
        it("returns the query string specified in the URL", () => {
            const unit = URL.fromLocation("http://example.com:443/this/is/a/path?with=search#andFragment");
            const expectedValue = "?with=search";

            const actualValue = unit.search;

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns an empty string if the URL has no query string", () => {
            const unit = URL.fromLocation("http://example.com:443/this/is/a/path#andFragment");
            const expectedValue = "";

            const actualValue = unit.search;

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".searchParams getter", () => {
        it("returns the contents of the query string specified in the URL", () => {
            const unit = URL.fromLocation("http://example.com:443/this/is/a/path?with=search#andFragment");
            const expectedValue = new url.URLSearchParams("with=search");

            const actualValue = unit.searchParams;

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns an empty URLSearchParams if the URL has no query string", () => {
            const unit = URL.fromLocation("http://example.com:443/this/is/a/path?with=search#andFragment");
            const expectedValue = new url.URLSearchParams("");

            const actualValue = unit.searchParams;

            expect(actualValue).to.eql(expectedValue);
        });
    });

    describe(".toJSON()", () => {
        it("returns the URL as a string", () => {
            const inputLocation = "http://example.com:443/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = inputLocation;

            const actualValue = unit.toJSON();

            expect(actualValue).to.eql(expectedValue);
        });

        it("does NOT return a valid JSON string (just like NodeJS's URL.toJSON())", () => {
            const inputLocation = "http://example.com:443/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = JSON.stringify(inputLocation);

            const actualValue = unit.toJSON();

            expect(actualValue).to.not.eql(expectedValue);
        });
    });

    describe(".dirname()", () => {
        it("returns a URL that points to the parent of this URL", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.from(null, "http://example.com:8080/this/is/a");
            const actualValue = unit.dirname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns the root URL, if given a URL with no path", () => {
            const inputLocation = "http://example.com:8080?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.from(null, "http://example.com:8080/");
            const actualValue = unit.dirname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns a URL with the same `base` as the original URL", () => {
            const inputBase = "http://example.com:8080";
            const inputLocation = "/this/is/a/path?with=search#andFragment";
            const expectedValue = URL.from(inputBase, "/this/is/a");

            const unit = URL.from(inputBase, inputLocation);
            const actualValue = unit.dirname();

            expect(actualValue).to.eql(expectedValue);
        });
    });

    describe(".join()", () => {
        it("returns a new URL with our path changes", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/an/example");

            const actualValue = unit.join("..", "..", "an/example");

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns a new URL with the same base value", () => {
            const inputBase = "http://example.com:8080/this/is";
            const inputLocation = "a/path?with=search#andFragment";
            const unit = URL.from(inputBase, inputLocation);
            const expectedValue = URL.from(inputBase, "http://example.com:8080/this/is/an/example").base;

            const actualValue = unit.join("..", "..", "an/example").base;

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a mix of URLs and paths", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example");

            const actualValue = unit.join(
                "http://www.example.com/different/and",
                "..", "..", "an/example"
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("accepts a mix of URLs and paths and query strings", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch");

            const actualValue = unit.join(
                "http://www.example.com/different/and",
                "..", "..", "an/example",
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("changing the query string drops the hash", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/a/path?thisIs=aSearch");

            const actualValue = unit.join(
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("the hash can be changed without affecting the query string", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#anotherFragment");

            const actualValue = unit.join(
                "#anotherFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("accepts a mix of URLs and paths and query strings and hashes", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch#withFragment");

            const actualValue = unit.join(
                "http://www.example.com/different/and",
                "..", "..", "an/example",
                "?thisIs=aSearch",
                "#withFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("path changes cause any prior hash to be dropped", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch");

            const actualValue = unit.join(
                "http://www.example.com/different/and",
                "#withFragment",
                "..", "..", "an/example",
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("path changes cause any prior search to be dropped", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example#withFragment");

            const actualValue = unit.join(
                "http://www.example.com/different/and",
                "?thisIs=aSearch",
                "..", "..", "an/example",
                "#withFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });
    });

    describe(".parse()", () => {
        it("returns a breakdown of the URL's contents", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue: ParsedURL = {
                protocol: "http:",
                hostname: "example.com",
                port: "8080",
                pathname: "/this/is/a/path",
                search: "?with=search",
                searchParams: new URLSearchParams("with=search"),
                hash: "#andFragment",
            }

            const actualValue = unit.parse();

            expect(actualValue).to.eql(expectedValue);
        });

        it("only sets the fields that have a meaningful value", () => {
            const inputLocation = "http://example.com";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue: ParsedURL = {
                protocol: "http:",
                hostname: "example.com",
                pathname: "/",
            }

            const actualValue = unit.parse();

            expect(actualValue).to.eql(expectedValue);
        });
    });

    describe(".resolve()", () => {
        it("returns a new URL with our path changes", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/an/example");

            const actualValue = unit.resolve("..", "..", "an/example");

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns a new URL with its own base value", () => {
            const inputBase = "http://example.com:8080/this/is/";
            const inputLocation = "a/path?with=search#andFragment";
            const unit = URL.from(inputBase, inputLocation);
            const expectedValue = URL.fromBase("http://example.com:8080/this/is/an/example").base;

            const actualValue = unit.resolve("..", "..", "an/example").base;

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts a mix of URLs and paths", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example");

            const actualValue = unit.resolve(
                "http://www.example.com/different/and",
                "..", "..", "an/example"
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("accepts a mix of URLs and paths and query strings", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch");

            const actualValue = unit.resolve(
                "http://www.example.com/different/and",
                "..", "..", "an/example",
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("changing the query string drops the hash", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/a/path?thisIs=aSearch");

            const actualValue = unit.resolve(
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("the hash can be changed without affecting the query string", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://example.com:8080/this/is/a/path?with=search#anotherFragment");

            const actualValue = unit.resolve(
                "#anotherFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("accepts a mix of URLs and paths and query strings and hashes", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch#withFragment");

            const actualValue = unit.resolve(
                "http://www.example.com/different/and",
                "..", "..", "an/example",
                "?thisIs=aSearch",
                "#withFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("path changes cause any prior hash to be dropped", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example?thisIs=aSearch");

            const actualValue = unit.resolve(
                "http://www.example.com/different/and",
                "#withFragment",
                "..", "..", "an/example",
                "?thisIs=aSearch",
            );

            expect(actualValue).to.eql(expectedValue);
        });

        it("path changes cause any prior search to be dropped", () => {
            const inputLocation = "http://example.com:8080/this/is/a/path?with=search#andFragment";
            const unit = URL.fromLocation(inputLocation);
            const expectedValue = URL.fromLocation("http://www.example.com/different/and/an/example#withFragment");

            const actualValue = unit.resolve(
                "http://www.example.com/different/and",
                "?thisIs=aSearch",
                "..", "..", "an/example",
                "#withFragment",
            );

            expect(actualValue).to.eql(expectedValue);
        });
    });
});
