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
import url from "url";

/**
 * the parts of a URL, using terms from the WHATWG specification
 *
 * NOTE that we do *NOT* support the `username` and `password` fields.
 * These are deprecated by RFC 3986, and may not be supported by your
 * choice of browser AND/OR your destination.
 *
 * NOTE that we do *NOT support protocol-relative URLs here, because
 * the underlying NodeJS URL doesn't support them
 */
export interface ParsedURL {
    [key: string]: string|URLSearchParams|undefined;

    /**
     * the network protocol to use (eg 'http' or 'https')
     */
    protocol: string;

    /**
     * the server where the remote data is hosted
     */
    hostname: string;

    /**
     * the port number to connect to on the remote hostname
     */
    port?: string;

    /**
     * the query path portion of the URL
     */
    pathname: string;

    /**
     * the query string portion of the URL
     */
    search?: string;

    /**
     * the query string portion of the URL, as a data bag
     */
    searchParams?: url.URLSearchParams;

    /**
     * the #fragment section of the URL
     */
    hash?: string;
}
