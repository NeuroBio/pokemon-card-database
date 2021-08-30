import csv
from pathlib import Path
from  get_expansion_functions import make_csv

# get the list of expansions...
misc = [
    'EX Trainer Kit',
    'POP Series 1',
    'POP Series 4'
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