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

export interface BearerDataObject {
    u: any,
    d: number,
}

export class BearerData {
    /**
     * Creates a new bearer data object.
     * @param udata the user data.
     * @param creation_date the creation date.
     */
    public constructor(public readonly udata: any, public readonly creation_date: Date = new Date()) { }

    /**
     * Gets the object version.
     * @returns the object.
     */
    public to_object(): BearerDataObject {
        return {
            u: this.udata,
            d: this.creation_date.getTime()
        };
    }

    /**
     * Gets an bearer data class from given object.
     * @param object the object.
     * @returns the BearerData clas.
     */
    public static from_object(object: BearerDataObject): BearerData {
        return new BearerData(object.u, new Date(object.d));
    }
}
