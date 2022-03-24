# Simple XOATH2 Library for NodeJS

This is a simple library for creating XOAUTH2 tokens for SASL supporting systems, also for the convenience I've added some
simple bearer creation and verification.

## Usage

```ts
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

```