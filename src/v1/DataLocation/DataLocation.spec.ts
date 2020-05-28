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

import { DataLocation } from ".";

// protocol & extension needed to test addExtension()
interface AddDummyFeature {
    getDummyValue(): string;
}
// tslint:disable-next-line: max-classes-per-file
abstract class DataLocationAddDummyFeature extends DataLocation implements AddDummyFeature {
    public getDummyValue() {
        return "dummy value";
    }
}
const AddDummyFeatureProtocolDef = [ "getDummyValue" ];

// tslint:disable-next-line: max-classes-per-file
class UnitTestClass extends DataLocation
{
    public constructor(base: DataLocation|string|null, location: DataLocation|string) {
        super(base, location);
    }

    public valueOf(): string {
        return "no value";
    }
}

describe("DataLocation", () => {
    describe(".constructor()", () => {
        it("accepts a `null` base", () => {
            expect(() => new UnitTestClass(null, ".")).to.not.throw();
        });

        it("accepts a `DataLocation` base", () => {
            const inputValue = new UnitTestClass(null, ".");
            expect(() => new UnitTestClass(inputValue, ".")).to.not.throw();
        });

        it("accepts a `DataLocation` location", () => {
            const inputValue = new UnitTestClass(null, ".");
            expect(() => new UnitTestClass(null, inputValue)).to.not.throw();
        });
    });

    describe(".base property", () => {
        const inputBases = [
            ".",
            null
        ];

        for (const inputBase of inputBases) {
            it("contains the `base` '" + inputBase + "' passed into the constructor", () => {
                const unit = new UnitTestClass(inputBase, ".");
                const actualValue = unit.base;

                expect(actualValue).to.equal(inputBase);
            });
        }
    });

    describe(".location property", () => {
        const inputLocations = [
            ".",
        ];

        for (const inputLocation of inputLocations) {
            it("contains the `location` '" + inputLocation + "' passed into the constructor", () => {
                const unit = new UnitTestClass(".", inputLocation);
                const actualValue = unit.location;

                expect(actualValue).to.equal(inputLocation);
            });
        }
    });

    describe(".addExtension()", () => {
        it("adds extra features to the DataLocation type", () => {
            const expectedValue = "dummy value";

            const unit = new UnitTestClass(null, "/tmp/example")
                         .addExtension(DataLocationAddDummyFeature.prototype);

            const actualValue = unit.getDummyValue();
            expect(actualValue).to.equal(expectedValue);
        });
    });

    describe(".implementsProtocol()", () => {
        it("returns `true` if the protocol is supported", () => {
            const expectedValue = true;

            const unit = new UnitTestClass(null, "/tmp/example")
                         .addExtension(DataLocationAddDummyFeature.prototype);

            const actualValue = unit.implementsProtocol(AddDummyFeatureProtocolDef);
            expect(actualValue).to.equal(expectedValue);
        });

        it("returns `false` otherwise", () => {
            const expectedValue = false;

            const unit = new UnitTestClass(null, "/tmp/example");

            const actualValue = unit.implementsProtocol(AddDummyFeatureProtocolDef);
            expect(actualValue).to.equal(expectedValue);
        });
    });
});
