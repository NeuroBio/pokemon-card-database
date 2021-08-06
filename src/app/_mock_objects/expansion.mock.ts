import { Card, SetExpansion } from "../_objects/expansion";

export class MockSetExpansion {
    mock(numCards: number = 10, name: string = 'Test') {
        const cards = [];
        const mock = new MockCard();
        for (let i = 0; i < numCards; i++) {
            cards.push(mock.mock(i));
        }
        return new SetExpansion(name, cards, 1, 1, cards.length)
    }

    mockUpload(gens: number[] = [1], expansions: SetExpansion[][]) {
        const upload = {}
        gens.forEach((gen, i) => {
            upload[`Gen-${gen}`] = {
                data: {},            
                lastUpdated: 0
            } 
            expansions[i].forEach(exp =>
                upload[`Gen-${gen}`].data[exp.name] = exp
            );
        });
    }
}

export class MockCard {
    mock(int: number = 0) {
        return new Card(`Test-${int}`, 'Pokémon', int, int, 'Common');
    }
}
