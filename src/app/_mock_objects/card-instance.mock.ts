import { CardInstance, CardStorage, Flaw, Population } from "../_objects/card-instance";

export class MockCardInstance {
    mock(int: number = 0, expName: string = 'Base Set') {
        const mock = new MockFlaw();
        return new CardInstance(int, expName, 'standard', 'NM', [mock.mock()], 'This is a test card');
    }

    mockAllCards(expNames: string[] = ['Base Set'], prints: number[][] = [[1, 2, 3, 4]]) {
        const upload = {};
        expNames.forEach((exp, i) =>
            prints[i].forEach(print =>
                upload[`${exp}-${print}`] = this.mockUploadInstance(exp, print)
        ) );
        return upload;
    }
    
    mockUploadInstance(expName: string = 'Base Set', print: number = 1, cards: number = 1) {
        const mock = new MockCardInstance();
        const upload = {
            cards: {},
            expansionName: expName,
            printNumber: print
        };
        for (let i = 0; i < cards; i++) {
            const card = mock.mock(print, expName);
            upload.cards[card.uid] = card; 
        }
        return upload;
    }
}

export class MockFlaw {
    mock() {
        return new Flaw('flaw-type', 'flaw-where', 'flaw-landmark', 'flaw-severity');
    }
}

export class MockCardStorage {
    mock(expName: string = 'Test', print: number = 0) {
        return new CardStorage(expName, print)
    }
}

export class MockPopulation {
    mock() {
        const pop = new Population()
        pop.Pokémon = 10;
        pop.Trainer = 10;
        pop.Energy = 10;
        pop.TCGO = 10;
        pop.SpecialEnergy = 10;
        return pop;
    }
    
}
