import csv
from pathlib import Path
from  get_expansion_functions import make_csv

# get the list of expansions...
misc = [
    'EX Trainer Kit',
    'POP Series 1',
    'POP Series 2',
    'POP Series 3',
    'POP Series 4',
    'POP Series 5',
    'POP Series 6',
    'POP Series 7',
    'POP Series 8',
    'POP Series 9',
    'Nintendo Black Star Promos',
    'DP Black Star Promos',
    'XY Black Star Promos'
]
for string in misc:

    # skip expansions is a .csv already exists
    if Path(f"expansions/{string}.csv").exists():
        print(f"Skipping {string}")
        continue

    # fetch expansion
    print(f"Start parsing {string} ...", end='')
    make_csv(string, 'expansions')

# announce complete
print('Finished fetching expansions.')