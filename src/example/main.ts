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

import fs from 'fs';
import path from 'path';
import { BearerData } from '../BearerData';
import { Signer } from '../Signer';
import { XOATH2Token } from '../XOAUTH2Token';

// Reads the public and private key.
const public_key: Buffer = fs.readFileSync(path.join(__dirname, '../../public.key'));
const private_key: Buffer = fs.readFileSync(path.join(__dirname, '../../private.key'));

// Creates the signer.
const signer: Signer = new Signer(public_key, private_key);

// Creates the bearer data.
const bearer_data: BearerData = new BearerData({ test: 123 });

// Creates the signed bearer, validates it and creates the XOAUTH2 token.
const signed_bearer: string = signer.sign(bearer_data);
console.log(signer.validate(signed_bearer));
const token: XOATH2Token = new XOATH2Token('luke', signed_bearer);

// Encodes the token, and decodes it (just to test.)
const encoded_token: string = token.encode();
console.log(encoded_token)
console.log(XOATH2Token.decode(encoded_token))

