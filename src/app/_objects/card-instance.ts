import * as uuid from 'uuid';

export class CardInstance {
    printNumber: number;
    condition: 'M' | 'NM' | 'LP' | 'MP' | 'HP';
    expansionName: string;
    type: string;
    uid: string;
    front?: string;
    back?: string;
    creases?: Flaw[];
    scratches?: Flaw[];
    dents?: Flaw[];
    whitening?: Flaw[];

    constructor(
        num: number, expansion: string, type: string, condition: 'M' | 'NM' | 'LP' | 'MP' | 'HP',
        creases?: Flaw[], scratches?: Flaw[], dents?: Flaw[], whitening?: Flaw[]) {
            this.printNumber = num;
            this.expansionName = expansion;
            this.type = type;
            this.condition = condition;
            this.creases = creases;
            this.scratches = scratches;
            this.dents = dents;
            this.whitening = whitening;
            this.uid = uuid.v4();
    }
}

export class Flaw {
    where: 'top-center' | 'top-right' | 'right-center' | 'bottom-right'
        | 'bottom-center' | 'bottom-left' | 'left-center' | 'top-left'
    landmark: 'edge' | 'corner' | 'illustration' | 'holo' | 'text-box'
    severity: 'mild' | 'moderate' | 'severe'

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
