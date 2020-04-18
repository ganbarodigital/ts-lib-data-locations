//
// Copyright (c) 2020-present Ganbaro Digital Ltd
// All rights reserved.
//

/**
 * do `base` and `location` combine to (possibly) be a location on a
 * filesystem?
 *
 * we don't check whether the path exists, or even that it's a valid path
 * for the filesystem it would map onto ... merely that it *could* be a
 * credible path
 *
 * @param base
 *        the base folder / file to start from
 * @param location
 *        the (possibly absolute) path to add to `base`
 */
export function isURL(location: string): boolean {
    const markers = [
        // relative or absolute HTTP request
        "http:",
        // relative or absolute HTTPS request
        "https:",
        // absolute request using the current protocol
        "//",
    ];

    for (const marker of markers) {
        if (location.startsWith(marker)) {
            return true;
        }
    }

    return false;
}