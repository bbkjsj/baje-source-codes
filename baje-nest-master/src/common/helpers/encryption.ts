import * as clib from "cryptlib";

export class Encryption { 
    private iv 
    private key;

    constructor(){
        this.iv = 'Z66RYU1AT6AZ2';
        this.key = 'HPP775p42CzU3yZU7Imelj37D52XvW19';
    }


    encrypt(phrase: string) { 
        return clib.encrypt(phrase, this.key, this.iv);
    }

    decrypt(cipher: string) { 
        return clib.decrypt(cipher, this.key, this.iv);
    }
}