import * as uuid from 'uuid';

export class CardInstance {
    printNumber: number;
    condition: 'M' | 'NM' | 'LP' | 'MP' | 'HP';
    expansionName: string;
    form: string;
    uid: string;
    front?: string;
    back?: string;
    flaws?: Flaw[]

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

    constructor(
        where: 'top-center' | 'top-right' | 'right-center' | 'bottom-right'
        | 'bottom-center' | 'bottom-left' | 'left-center' | 'top-left',
        landmark: 'edge' | 'corner' | 'illustration' | 'holo' | 'text-box',
        severity: 'mild' | 'moderate' | 'severe') {
        this.where = where;
        this.landmark = landmark;
        this.severity = severity;
    }
}

export class FlawInfo {
    types = ['crease', 'dent', 'scratch', 'whitening', 'burn', 'surface damage'];
    wheres = [
        'top-center', 'top-right', 'right-center', 'bottom-right',
        'bottom-center', 'bottom-left', 'left-center', 'top-left'
    ];
    landmarks = ['edge', 'corner', 'illustration', 'holo', 'text-box'];
    severities = ['negligible', 'mild', 'moderate', 'severe'];
}
