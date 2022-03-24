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

import crypto from 'crypto';
import { BearerData, BearerDataObject } from "./BearerData";

export class Signer {
    protected static readonly ALGORITHM: string = 'RSA-SHA256';
    protected static readonly ENCODING: BufferEncoding = 'hex';
    protected static readonly SEPARATOR: string = '.';

    /**
     * Creates a bearer signer.
     * @param public_key the public key.
     * @param private_key the private key.
     */
    public constructor(public readonly public_key: Buffer, public readonly private_key: Buffer) { }

    /**
     * Signs the given bearer.
     * @param bearer_data the bearer data.
     * @returns The signed bearer.
     */
    public sign(bearer_data: BearerData): string {
        // Encodes the bearer.
        const encoded_data: string = JSON.stringify(bearer_data.to_object());
        const encoded_data_buffer: Buffer = Buffer.from(encoded_data, 'utf-8');

        // Creates the signature.
        const signature: Buffer = crypto.createSign(Signer.ALGORITHM)
            .update(encoded_data_buffer)
            .sign(this.private_key);

        // Returns the result.
        return `${encoded_data_buffer.toString(Signer.ENCODING)}${Signer.SEPARATOR}${signature.toString(Signer.ENCODING)}`;
    }

    /**
     * Validates the given bearer.
     * @param bearer the bearer to validate.
     * @returns the bearer data.
     */
    public validate(bearer: string): BearerData {
        // Splits the signed bearer.
        const segments: string[] = bearer.split(Signer.SEPARATOR);
        if (segments.length !== 2) {
            throw new Error('Invalid signed bearer.');
        }

        // Gets both segments.
        const [ data_segment, signature_segment ] = segments;

        // Gets the buffers for both segments.
        const encoded_data_buffer: Buffer = Buffer.from(data_segment, Signer.ENCODING);
        const signature_buffer: Buffer = Buffer.from(signature_segment, Signer.ENCODING);

        // Verifies the signature.
        const valid: boolean = crypto.createVerify(Signer.ALGORITHM)
            .update(encoded_data_buffer)
            .verify(this.public_key, signature_buffer);

        // If the signature is not valid, throw error.
        if (!valid) {
            throw new Error('Signature is not valid.');
        }

        // Decodes the bearer data.
        const encoded_data: string = encoded_data_buffer.toString('utf-8');
        const object: BearerDataObject = JSON.parse(encoded_data);

        // Returns the resulting bearer.
        return BearerData.from_object(object);
    }
}