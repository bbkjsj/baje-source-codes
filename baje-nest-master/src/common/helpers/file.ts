export class FileClass { 
    constructor(private module: string,
        private filename: string) { 
        this.module = module;
        this.filename = filename;
    }


    generateFileName(): string { 
        return `/files/${this.module}/${this.filename}`;
    }
}