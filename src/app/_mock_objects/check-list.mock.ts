import { Checklist } from "../_objects/checklist";

export class MockChecklist {
    mock(listName: string = 'Test-List', keys: string[] = this.mockKeys()) {
        return new Checklist(listName, keys)
    }

    mockKeys(expName: string = 'Base Set', prints: number[] = [1, 2, 3, 4, 5]) {
        return prints.map(print => `${expName}-${print}`);
    }
}