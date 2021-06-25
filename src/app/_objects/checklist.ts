export class Checklist {
    name: string;
    cardKeys: string[];
    checkInfo: CheckInfo[];
    lastUpdated: number;
    deleted?: number;
    startOn?: number;

    constructor(name: string, keys: string[], startOn?: number) {
        this.name = name;
        this.cardKeys = keys;
        this.checkInfo = new Array(keys.length).fill('');
        this.startOn = startOn;
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

export class PopulateMethod {
    method: string;
    key?: string;
    uid?: string;

    constructor(method: string, exp?: string, print?: string, uid?: string) {
        this.method = method;
        if (method === 'useCard') {
            this.key = `${exp}-${print}`;
            this.uid = uid;
        }
    }
}
