import { CardChunk } from '../_objects/card-chunk';
import { SetExpansion } from '../_objects/expansion';

export class MockCardChunk {
    mock(expansion: SetExpansion, print: number = 1) {
        return new CardChunk(print, expansion);
    }
}
