export class Checklist {
    name: string;
    cardKeys: string[];
    checkInfo: CheckInfo[];

    constructor(name: string, keys: string[]) {
        this.name = name;
        this.cardKeys = keys;
        this.checkInfo = new Array(keys.length).fill('');
    }
}

export class CheckInfo {
    placeholder: boolean;
    uid: string;
    key: string;

    constructor(placeholder: boolean, uid: string, key: string) {
        this.placeholder = placeholder;
        this.uid = uid;
        this.key = key;
    }
}