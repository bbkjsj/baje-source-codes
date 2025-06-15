export class RandomNumber { 
    constructor(public fromNumber, public toNumber){}

    generate():number { 
        const num =  Math.random() * (this.toNumber - this.fromNumber) + this.fromNumber;
        return Math.floor(num);
    }
}