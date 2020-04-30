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
import {
    AnyAppError,
    OnError,
    THROW_THE_ERROR,
} from "@ganbarodigital/ts-lib-error-reporting/lib/v1";
import { expect } from "chai";
import { describe } from "mocha";
import path from "path";

import { Filepath } from ".";
import { DataLocation } from "../DataLocation";
import { NotAFilepathError } from "../Errors";
import { DummyPathApi } from "./testFixtures";

class UnitTestClass extends Filepath
{
    public constructor(base: string|null, location: string) {
        super(base, location);
    }
}

describe("Filepath", () => {
    describe("parent", () => {
        it("is a DataLocation", () => {
            const unit = Filepath.fromBase(".");

            expect(unit).to.be.instanceOf(DataLocation);
        });

        it("is a Value", () => {
            const unit = Filepath.fromBase(".");
            if (unit.isValue()) {
                expect(true).to.equal(true);
            }
            else {
                expect(true).to.equal(false);
            }
        });
    });

    describe(".format() (static constructor)", () => {
        it("builds a Filepath from the given parts", () => {
            const inputValue = {
                "base": "file.ts",
                "dir": "/tmp/example",
                "ext": ".ts",
                "name": "file",
                "root": "/"
            };
            const expectedValue = Filepath.fromLocation("/tmp/example/file.ts", THROW_THE_ERROR, path.posix);

            const actualValue = Filepath.format(null, inputValue);
            expect(actualValue).to.eql(expectedValue);
        });

        it("builds a Filepath from the given base and parts", () => {
            const inputValue = {
                "base": "file.ts",
                "dir": "example",
                "ext": ".ts",
                "name": "file",
                "root": "/"
            };
            const expectedValue = Filepath.from("/tmp", "example/file.ts", THROW_THE_ERROR, path.posix);

            const actualValue = Filepath.format("/tmp", inputValue);
            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the supplied pathApi", () => {
            const inputValue = {
                "base": "file.ts",
                "dir": "/tmp/example",
                "ext": ".ts",
                "name": "file",
                "root": "/"
            };
            const dummyApi = new DummyPathApi();
            dummyApi.formatResponses = [ "/tmp/example/file.ts" ];
            dummyApi.normalizeResponses = [ "/tmp/example/file.ts" ];

            const expectedCallList = [
                "format()",
                "normalize()",
            ];
            const expectParamList = [
                // from the call to unit.format()
                inputValue,

                // from the call to normalize()
                "/tmp/example/file.ts",
            ];

            const unit = Filepath.format(null, inputValue, THROW_THE_ERROR, dummyApi);
            expect(unit).to.be.instanceOf(Filepath);

            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".from()", () => {
        it("accepts a `null` base", () => {
            expect(() => Filepath.from(null, ".")).to.not.throw();
        });

        it("auto-resolves `base` and `location`", () => {
            const inputBase = ".";
            const inputLocation = "..";
            const expectedValue = path.dirname(process.cwd());

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.valueOf();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts an alternative error handler", () => {
            const onError: OnError = (err: AnyAppError) => {
                throw new Error("test error handler called!!");
            }

            expect(() => Filepath.from("https://not-a-path", "", onError)).to.throw("test error handler called!!");
        });

        it("has a default path API of the NodeJS path module", () => {
            const unit = Filepath.from(null, ".");
            expect(unit.pathApi).to.eql(path);
        })

        it ("rejects a URL in the `base` parameter", () => {
            expect(() => Filepath.from("http://example.com", ".")).to.throw(NotAFilepathError);
        })

        it ("rejects a URL in the `location` parameter", () => {
            expect(() => Filepath.from(null, "http://example.com")).to.throw(NotAFilepathError);
        })

        it("uses the provided pathApi", () => {
            const inputBase = ".";
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = [inputLocation];
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "resolve()",
                "normalize()",
            ];
            const expectParamList = [
                // from the call to resolve()
                [ ".", "example.ts" ],

                // from the call to normalize()
                "example.ts",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit).to.be.instanceOf(Filepath);

            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".fromBase()", () => {
        it("uses the given path as the `base` for the Filepath", () => {
            const inputBase = "/tmp/example";
            const expectedValue = inputBase;

            const unit = Filepath.fromBase(inputBase);
            const actualValue = unit.base;

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the given path as the value for the Filepath", () => {
            const inputBase = "/tmp/example";
            const expectedValue = inputBase;

            const unit = Filepath.fromBase(inputBase);
            const actualValue = unit.valueOf();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts an alternative error handler", () => {
            const onError: OnError = (err: AnyAppError) => {
                throw new Error("test error handler called!!");
            }

            expect(() => Filepath.fromBase("https://not-a-path", onError)).to.throw("test error handler called!!");
        });

        it("has a default path API of the NodeJS path module", () => {
            const unit = Filepath.fromBase(".");
            expect(unit.pathApi).to.eql(path);
        });

        it ("rejects a URL in the `base` parameter", () => {
            expect(() => Filepath.fromBase("http://example.com")).to.throw(NotAFilepathError);
        });

        it("uses the provided pathApi", () => {
            const inputBase = "/tmp/example/file";
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = [inputBase];
            dummyApi.normalizeResponses = [inputBase];

            const expectedCallList = [
                "resolve()",
                "normalize()",
            ];
            const expectParamList = [
                // from the call to resolve()
                [ "/tmp/example/file", "" ],

                // from the call to normalize()
                "/tmp/example/file",
            ];

            const unit = Filepath.fromBase(inputBase, THROW_THE_ERROR, dummyApi);
            expect(unit).to.be.instanceOf(Filepath);

            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".fromLocation()", () => {
        it("uses the given path as the `location` for the Filepath", () => {
            const inputLocation = "/tmp/example";
            const expectedValue = inputLocation;

            const unit = Filepath.fromLocation(inputLocation);
            const actualValue = unit.location;

            expect(actualValue).to.equal(expectedValue);
        });

        it("sets the `base` of the Filepath to be `null`", () => {
            const inputLocation = "/tmp/example";
            const expectedValue = null;

            const unit = Filepath.fromLocation(inputLocation);
            const actualValue = unit.base;

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the given path as the value for the Filepath", () => {
            const inputLocation = "/tmp/example";
            const expectedValue = inputLocation;

            const unit = Filepath.fromLocation(inputLocation);
            const actualValue = unit.valueOf();

            expect(actualValue).to.equal(expectedValue);
        });

        it("accepts an alternative error handler", () => {
            const onError: OnError = (err: AnyAppError) => {
                throw new Error("test error handler called!!");
            }

            expect(() => Filepath.fromLocation("https://not-a-path", onError)).to.throw("test error handler called!!");
        });

        it("has a default path API of the NodeJS path module", () => {
            const unit = Filepath.fromLocation(".");
            expect(unit.pathApi).to.eql(path);
        });

        it ("rejects a URL in the `location` parameter", () => {
            expect(() => Filepath.fromLocation("http://example.com")).to.throw(NotAFilepathError);
        });

        it("uses the provided pathApi", () => {
            const inputLocation = "/tmp/example/file";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "normalize()",
            ];
            const expectParamList = [
                // from the call to normalize()
                "/tmp/example/file",
            ];

            const unit = Filepath.fromLocation(inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit).to.be.instanceOf(Filepath);

            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".constructor()", () => {
        it("accepts a `null` base", () => {
            expect(() => Filepath.from(null, ".")).to.not.throw();
        });

        it("auto-resolves `base` and `location`", () => {
            const inputBase = ".";
            const inputLocation = "..";
            const expectedValue = path.dirname(process.cwd());

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.valueOf();

            expect(actualValue).to.equal(expectedValue);
        });

        it("has a default path API of the NodeJS path module", () => {
            const unit = new UnitTestClass(null, ".");
            expect(unit.pathApi).to.eql(path);
        })

        it ("rejects a URL in the `base` parameter", () => {
            expect(() => new UnitTestClass("http://example.com", ".")).to.throw(NotAFilepathError);
        });

        it ("rejects a URL in the `location` parameter", () => {
            expect(() => new UnitTestClass(null, "http://example.com")).to.throw(NotAFilepathError);
        });

        it("accepts an alternative error handler", () => {
            const onError: OnError = (err: AnyAppError) => {
                throw new Error("test error handler called!!");
            }

            expect(() => Filepath.from(null, "https://not-a-path", onError)).to.throw("test error handler called!!");
        });

        it("uses the provided pathApi", () => {
            const inputBase = ".";
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = [inputLocation];
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "resolve()",
                "normalize()",
            ];
            const expectParamList = [
                // from the call to resolve()
                [ ".", "example.ts" ],

                // from the call to normalize()
                "example.ts",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit).to.be.instanceOf(Filepath);

            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".pathApi", () => {
        it("contains the path module passed into the constructor", () => {
            const unit = Filepath.from(null, ".", THROW_THE_ERROR, path.posix);
            expect(unit.pathApi).to.eql(path.posix);
        });
    })

    describe(".isValue()", () => {
        it("returns `true`", () => {
            const unit = Filepath.from(null, ".");
            expect(unit.isValue()).to.equal(true);
        });
    })

    describe(".valueOf()", () => {
        it ("returns the path built from the `base` and the `location`", () => {
            const inputBase = ".";
            const inputLocation = "..";
            const expectedValue = path.dirname(process.cwd());

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.valueOf();

            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe("type auto-conversion", () => {
        it ("auto-converts to a string", () => {
            const inputBase = ".";
            const inputLocation = "..";
            const expectedPath = path.dirname(process.cwd());
            const expectedValue = "the parent path is: " + expectedPath;

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = "the parent path is: " + unit;

            expect(actualValue).to.equal(expectedValue);
        });

        it("does not auto-convert to a number", () => {
            const unit = Filepath.from("/tmp", "example");
            const expectedValue = null;

            const actualValue = unit[Symbol.toPrimitive]("number");

            expect(actualValue).to.equal(expectedValue);
        })
    });

    describe(".basename()", () => {
        it("returns the basename of the Filepath", () => {
            const inputBase = null;
            const inputLocation = process.cwd();
            const expectedValue = path.basename(process.cwd());

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.basename();

            expect(actualValue).to.equal(expectedValue);
        });

        it("strips the extension from the Filepath, if it matches", () => {
            const inputBase = null;
            const inputLocation = "example.ts";
            const expectedValue = "example";

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.basename(".ts");

            expect(actualValue).to.equal(expectedValue);
        });

        it("preserves the extension of the Filepath, if it does not match", () => {
            const inputBase = null;
            const inputLocation = "example.ts";
            const expectedValue = "example.ts";

            const unit = Filepath.from(inputBase, inputLocation);
            const actualValue = unit.basename(".php");

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputBase = null;
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "basename()",
                "basename()",
            ];
            const expectParamList = [
                "example.ts",
                ".php",
                "example.ts",
                null,
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();

            unit.basename(".php");
            unit.basename();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".dirname()", () => {
        it("returns the name of the parent, as a Filepath", () => {
            const unit = Filepath.from(null, "/tmp", THROW_THE_ERROR, path.posix);

            const expectedValue = Filepath.from(null, "/");
            const actualValue = unit.dirname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputBase = null;
            const inputLocation = "/tmp";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "dirname()",

                // this is called by the constructor of the new Filepath
                // that unit.dirname() builds
                "normalize()",
            ];
            const expectParamList = [
                // from unit.dirname()
                "/tmp",

                // from the retval.constructor()
                "/",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("/tmp");

            dummyApi.reset();
            dummyApi.dirnameResponses = ["/"];
            dummyApi.normalizeResponses = ["/"];

            unit.dirname();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".extname()", () => {
        it("returns the Filepath's extension", () => {
            const unit = Filepath.from(null, "example.ts", THROW_THE_ERROR, path.posix);

            const expectedValue = ".ts"
            const actualValue = unit.extname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("returns an empty string if the Filepath has no extension", () => {
            const unit = Filepath.from(null, "example", THROW_THE_ERROR, path.posix);

            const expectedValue = ""
            const actualValue = unit.extname();

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputBase = null;
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "extname()",
            ];
            const expectParamList = [
                // from unit.extname
                "example.ts",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();
            dummyApi.extnameResponses = [".ts"];

            unit.extname();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".isAbsolute()", () => {
        it("returns true if the Filepath contains an absolute path", () => {
            const unit = Filepath.from(null, "/tmp", THROW_THE_ERROR, path.posix);
            const expectedValue = true;

            const actualValue = unit.isAbsolute();

            expect(actualValue).to.equal(expectedValue);
        });

        it("returns false if the Filepath contains a relative path", () => {
            const unit = Filepath.from(null, "./tmp", THROW_THE_ERROR, path.posix);
            const expectedValue = false;

            const actualValue = unit.isAbsolute();

            expect(actualValue).to.equal(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const inputBase = null;
            const inputLocation = "example.ts";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = [inputLocation];

            const expectedCallList = [
                "isAbsolute()",
            ];
            const expectParamList = [
                // from unit.isAbsolute()
                "example.ts",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("example.ts");

            dummyApi.reset();
            dummyApi.isAbsoluteResponses = [ true ];

            unit.isAbsolute();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".join()", () => {
        it("appends the given paths to the Filepath", () => {
            const unit = Filepath.from(null, "/tmp/this/is/an/example", THROW_THE_ERROR, path.posix);
            const expectedValue = Filepath.from(null, "/tmp/this/is/another/example", THROW_THE_ERROR, path.posix);

            const actualValue = unit.join("..", "..", "another/example");
            expect(actualValue).to.eql(expectedValue);
        });

        it("returns a Filepath that has the same `base` as the original Filepath", () => {
            const expectedBase = "/tmp/this/is";
            const unit1 = Filepath.from(expectedBase, "an/example", THROW_THE_ERROR, path.posix);

            const unit2 = unit1.join("..", "..", "another/example");
            const actualBase = unit2.base;

            expect(actualBase).to.eql(expectedBase);
        });

        it("uses the provided pathApi", () => {
            const inputBase = "/tmp/this/is";
            const inputLocation = "an/example";
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = ["/tmp/this/is/an/example"];

            const expectedCallList = [
                // from unit.join()
                "join()",

                // from the retval.constructor
                "resolve()",
                "normalize()",
            ];
            const expectParamList = [
                // from unit.join()
                [
                    "..",
                    "..",
                    "another/example",
                ],

                // from the retval.constructor
                [
                    "/tmp/this/is",
                    "/tmp/this/is/another/example",
                ],
                "/tmp/this/is/another/example",
            ];

            const unit = Filepath.from(inputBase, inputLocation, THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("/tmp/this/is/an/example");

            dummyApi.reset();
            dummyApi.joinResponses = ["/tmp/this/is/another/example"];
            dummyApi.resolveResponses = ["/tmp/this/is/another/example"];
            dummyApi.normalizeResponses = ["/tmp/this/is/another/example"];

            unit.join("..", "..", "another/example");
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".parse()", () => {
        it("breaks down the Filepath into consituent parts", () => {
            const unit = Filepath.from(null, "/tmp/example/file.ts");
            const expectedValue: path.ParsedPath = {
                "base": "file.ts",
                "dir": "/tmp/example",
                "ext": ".ts",
                "name": "file",
                "root": "/"
            };

            const actualValue = unit.parse();
            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.normalizeResponses = ["/tmp/example/file.ts"];

            const expectedCallList = [
                // from unit.parse()
                "parse()",
            ];
            const expectParamList = [
                // from unit.parse()
                "/tmp/example/file.ts",
            ];

            const unit = Filepath.from(null, "/tmp/example/file.ts", THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("/tmp/example/file.ts");

            dummyApi.reset();

            unit.parse();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".relative()", () => {
        it("returns the relative path between two Filepaths", () => {
            const unit1 = Filepath.from("/this/is", "an/example", THROW_THE_ERROR, path.posix);
            const unit2 = Filepath.from("/this/is", "another/example", THROW_THE_ERROR, path.posix);

            const expectedValue = "../../another/example";
            const actualValue = unit1.relative(unit2);

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = ["/tmp/this/is/an/example"];
            dummyApi.normalizeResponses = ["/tmp/this/is/an/example"];

            const expectedCallList = [
                // from unit.relative()
                "relative()",
            ];
            const expectParamList = [
                // from unit.relative()
                "/tmp/this/is/an/example",
                "/tmp/this/is/another/example"
            ];

            const unit1 = Filepath.from("/tmp/this/is", "an/example", THROW_THE_ERROR, dummyApi);
            expect(unit1.valueOf()).to.equal("/tmp/this/is/an/example");
            const unit2 = Filepath.from("/tmp/this/is", "another/example", THROW_THE_ERROR, path.posix);
            expect(unit2.valueOf()).to.equal("/tmp/this/is/another/example");

            dummyApi.reset();

            unit1.relative(unit2);
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".resolve()", () => {
        it("creates a new Filepath by applying the given path(s)", () => {
            const unit = Filepath.from("/tmp/this/is", "an/example", THROW_THE_ERROR, path.posix);
            const expectedValue = Filepath.from("/tmp/this/is/an/example", "../../another/example", THROW_THE_ERROR, path.posix);

            const actualValue = unit.resolve("..", "..", "another/example");

            expect(actualValue).to.eql(expectedValue);
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = ["/tmp/this/is/an/example"];
            dummyApi.normalizeResponses = ["/tmp/this/is/an/example"];

            const expectedCallList = [
                // from unit.resolve()
                "resolve()",

                // from the retval.constructor()
                "resolve()",
                "normalize()",
            ];
            const expectParamList = [
                // from unit.resolve()
                [ "..", "..", "another/example"],

                // from the retval.constructor
                [
                    "/tmp/this/is/an/example",
                    "../../another/example",
                ],
                "/tmp/this/is/another/example"
            ];

            const unit = Filepath.from("/tmp/this/is", "an/example", THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("/tmp/this/is/an/example");

            dummyApi.reset();
            dummyApi.resolveResponses = [
                "../../another/example",
                "/tmp/this/is/another/example",
            ];
            dummyApi.normalizeResponses = [ "/tmp/this/is/another/example" ];

            unit.resolve("..", "..", "another/example");
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });

    describe(".toNamespacedName()", () => {
        describe("on Windows", () => {
            it("converts a Filepath to a Win32 namespaced name", () => {
                const unit = Filepath.from(null, "c:\\Windows\\System", THROW_THE_ERROR, path.win32);
                const expectedValue = "\\\\?\\c:\\Windows\\System";

                const actualValue = unit.toNamespacedPath();
                expect(actualValue).to.equal(expectedValue);
                expect(actualValue).to.not.equal(unit.valueOf());
            });
        });

        describe("on POSIX", () => {
            it("returns the same as Filepath.valueOf()", () => {
                const unit = Filepath.from(null, "c:\\Windows\\System", THROW_THE_ERROR, path.posix);
                const expectedValue = "c:\\Windows\\System";

                const actualValue = unit.toNamespacedPath();
                expect(actualValue).to.equal(expectedValue);
                expect(actualValue).to.equal(unit.valueOf());
            });
        });

        it("uses the provided pathApi", () => {
            const dummyApi = new DummyPathApi();
            dummyApi.resolveResponses = ["c:\\Windows\\System"];
            dummyApi.normalizeResponses = ["c:\\Windows\\System"];

            const expectedCallList = [
                // from unit.toNamespacedPath()
                "toNamespacedPath()",
            ];
            const expectParamList = [
                // from unit.toNamespacedPath()
                "c:\\Windows\\System",
            ];

            const unit = Filepath.from(null, "c:\\Windows\\System", THROW_THE_ERROR, dummyApi);
            expect(unit.valueOf()).to.equal("c:\\Windows\\System");

            dummyApi.reset();
            dummyApi.toNamespacedPathResponses = [
                "c:\\Windows\\System",
            ];

            unit.toNamespacedPath();
            const actualCallList = dummyApi.calledList;
            const actualParamList = dummyApi.paramList;

            expect(actualCallList).to.eql(expectedCallList);
            expect(actualParamList).to.eql(expectParamList);
        });
    });
});
