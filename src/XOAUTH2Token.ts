/*
    Copyright 2022 Luke A.C.A. Rieff (Skywa04885)

    Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), 
    to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, 
    and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, 
    WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

export const XOATH2_USER_KEY = 'user';
export const XOATH2_AUTH_KEY = 'auth';

/**
 * Encodes the given token data to a string.
 * @param token_data the token data.
 * @returns the encoded date.
 */
export function xoath2_token_contents_encode(token_data: {[key:string]: string}) {
    let pairs: string[] = [];
    for (const [ key, value ] of Object.entries(token_data)) {
        pairs.push(`${key}=${value}`);
    }
    return `${pairs.join('\x01')}\x01\x01`;
}

/**
 * Decodes the raw token data.
 * @param raw_token the raw token.
 * @returns the object with the token data.
 */
export function xoath2_token_contents_decode(raw_token: string): { [key: string]: string } {
    // Makes sure the token ends with ^A^A, if not throw error.
    if (!raw_token.endsWith(`\x01\x01`)) {
        throw new Error('XOATH2 Token does not end with ^A^A');
    }

    // Trims the ^A^A from the string.
    raw_token = raw_token.substring(0, raw_token.length - 2);

    // Splits the remaining part of the token.
    const segments: string[] = raw_token.split('\x01');

    // Loops over the segments and constructs an object.
    let token_data: { [key: string]: string } = {};
    segments.forEach((segment: string) => {
        // Trims just to be sure.
        segment = segment.trim();

        // Splits the segment at '='.
        const splitted_segment: string[] = segment.split('=');
        if (splitted_segment.length !== 2) {
            throw new Error('One of the XOATH2 token segments is invalid.');
        }

        // Gets the key and value of the segment.
        const [key, value] = splitted_segment;

        // Inserts the key, value pair in the object.
        token_data[key] = value;
    });
    return token_data;
}

export class XOATH2Token {
    protected static readonly ENCODING: BufferEncoding = 'base64';

    /**
     * Constructs a new XOATH2 token.
     * @param user the user.
     * @param bearer the bearer.
     */
    public constructor(public readonly user: string, public readonly bearer: string) { }

    /**
     * Encodes the XOAUTH2 token.
     * @returns the encoded token.
     */
    public encode(): string {
        const token_data: string = xoath2_token_contents_encode({
            user: this.user,
            auth: `Bearer ${this.bearer}`,
        });

        return Buffer.from(token_data, 'utf-8').toString(XOATH2Token.ENCODING);
    }

    /**
     * Decodes the given XOAUTH2 token.
     * @param base64_token the base64 token.
     * @returns The decoded XOAUTH2 token.
     */
    public static decode(base64_token: string): XOATH2Token {
        // Decodes the token to a raw string.
        const raw_token: string = Buffer.from(base64_token, 'base64').toString('utf-8');

        // Decodes the raw string to an object.
        const token_data: {[key: string]: string} = xoath2_token_contents_decode(raw_token);

        // Makes sure both fields are present.
        if (!token_data[XOATH2_AUTH_KEY] || !token_data[XOATH2_USER_KEY]) {
            throw new Error('XOATH2 Token is invalid, missing fields.');
        }

        // Splits the auth key.
        const auth_segments: string[] = token_data[XOATH2_AUTH_KEY].split(' ');
        if (auth_segments.length !== 2) {
            throw new Error('XOAUTH2 Token is invalid, invalid auth value.');
        }

        // Checks and strips the bearer of the auth value.
        if (auth_segments[0].toLocaleLowerCase() !== 'bearer') {
            throw new Error('XOAUTH2 Token is invalid, Bearer missing.');
        }
        
        // Returns the result.
        return new XOATH2Token(token_data[XOATH2_USER_KEY], auth_segments[1]);
    }
}