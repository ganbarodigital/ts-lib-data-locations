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
import { formatIpPortAsString } from "../IpPort";
import {
    isPRURLFormatOptions,
    isURLFormatOptionsWithHostname,
    PRURLFormatOptions,
    URLFormatOptions,
    URLFormatOptionsWithHostname,
} from "../URLFormatOptions";

/**
 * assembles a URL string from a list of given parts
 */
export function buildURLHref(parts: URLFormatOptions): string {
    // special case
    if (isPRURLFormatOptions(parts)) {
        return buildPRURL(parts);
    }

    // another special case
    if (isURLFormatOptionsWithHostname(parts)) {
        return buildURLHrefWithHostname(parts);
    }

    // general case
    return buildURLHrefCommonElements(parts);
}

/**
 * assembles a protocol-relative URL from the list of given parts
 */
export function buildPRURL(parts: PRURLFormatOptions): string {
    // this will hold the return value that we're building
    let href: string = "";

    // someone *could* set this to be `false`
    if (parts.protocolRelative) {
        href = "//";
    }

    // add in the hostname and (optional) port number
    href = href + buildURLHrefHostnameAndPort(parts);

    // do we need a separator after the host and port?
    href = href + buildURLAuthoritySeparator(parts);

    // add in the path et al, and we're out
    return href + buildURLHrefCommonElements(parts);
}

/**
 * assembles a URL that contains a hostname, from the list of given parts
 */
export function buildURLHrefWithHostname(parts: URLFormatOptionsWithHostname): string {
    // this will hold the return value that we're building
    let href: string = "";

    // the protocol is optional, because we have a hostname
    if (parts.protocol) {
        // special case - if the protocol came from an existing URL
        // object, it might already have a ':' on the end of it (sigh)
        if (parts.protocol.endsWith(":")) {
            href = parts.protocol + "//";
        } else {
            href = parts.protocol + "://";
        }
    }

    // add in the hostname and (optional) port number
    href = href + buildURLHrefHostnameAndPort(parts);

    // do we need a separator after the host and port?
    href = href + buildURLAuthoritySeparator(parts);

    // now add in the common elements
    return href + buildURLHrefCommonElements(parts);
}

/**
 * builds a string that contains the hostname (which is always required)
 * and the (optional) port number. The returned string is formatted
 * for use in a URL.
 */
function buildURLHrefHostnameAndPort(parts: URLFormatOptionsWithHostname | PRURLFormatOptions): string {
    let href = parts.hostname;

    // ports are optional
    if (parts.port) {
        href = href + ":" + formatIpPortAsString(parts.port);
    }

    return href;
}

function buildURLAuthoritySeparator(parts: URLFormatOptionsWithHostname | PRURLFormatOptions): string {
    if (!parts.pathname) {
        if (parts.hash || parts.search) {
            return "/";
        }
    }

    return "";
}

/**
 * this serves two purposes:
 *
 * 1. add in the common elements to protocol-relative URLs, and URLs that
 *    contain a hostname, and
 * 2. build a relative URL
 */
export function buildURLHrefCommonElements(parts: URLFormatOptions): string {
    // this will hold the return value that we're building
    let href = "";

    // do we have a query path to add?
    if (parts.pathname) {
        href = href + parts.pathname;
    }

    if (parts.search) {
        href = href + "?" + parts.search;
    }

    if (parts.hash) {
        href = href + "#" + parts.hash;
    }

    // all done
    return href;
}