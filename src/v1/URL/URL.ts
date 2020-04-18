//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//
import { DataLocation } from "../DataLocation";

export class URL extends DataLocation {
    public constructor(base: string|null, location: string) {
        super(base, location);
    }

    public valueOf(): string {
        return "";
    }
}