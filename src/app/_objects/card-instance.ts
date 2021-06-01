import * as uuid from 'uuid';

export class CardInstance {
    condition: 'M' | 'NM' | 'LP' | 'MP' | 'HP';
    expansionName: string;
    form: string;
    printNumber: number;
    uid: string;
    front?: string;
    back?: string;
    flaws?: Flaw[];

    constructor(
        num: number, expansion: string, form: string,
        condition: 'M' | 'NM' | 'LP' | 'MP' | 'HP', flaws?: Flaw[]) {
            this.printNumber = num;
            this.expansionName = expansion;
            this.form = form;
            this.condition = condition;
            this.flaws = flaws;
            this.uid = uuid.v4();
    }
}

export class Flaw {
    type: string;
    where: string;
    landmark: string;
    severity: string;

    constructor(type: string, where: string, landmark: string, severity: string) {
        this.type = type;
        this.where = where;
        this.landmark = landmark;
        this.severity = severity;
    }
}

export class FlawInfo {
    types = [
        'crease', 'dent', 'scratch', 'scratching', 'whitening', 'burn', 'scuffing',
        'surface damage', 'staining', 'warping', 'water damage', 'factory defaults'
    ];
    wheres = [
        'entire surface', 'top', 'bottom', 'left-side', 'right-side',
        'center', 'tip',
        'top-center', 'top-right', 'right-center', 'bottom-right',
        'bottom-center', 'bottom-left', 'left-center', 'top-left'
    ];
    landmarks = [
        'edge', 'corner', 'illustration', 'holo', 'text-box', 'all corners',
        'entire border', 'front', 'back', 'top back', 'bottom back', 'entire card'
    ];
    severities = ['negligible', 'mild', 'moderate', 'severe'];
}

export class CardStorage {
    cards: {};
    expansionName: string;
    printNumber: number;

    constructor(expansion: string, print: number) {
        this.expansionName = expansion;
        this.printNumber = print;
        this.cards = {};
    }
}
