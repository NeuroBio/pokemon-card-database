import csv
from pathlib import Path
from  get_expansion_functions import make_csv

# make_csv('Diamond & Pearl', 'expansions')

with open('expansions.csv') as exp:
    reader = csv.reader(exp)
    for row in reader:
        if Path(f"expansions/{row[0]}.csv").exists():
            print(f"Skipping {row[0]}")
            continue
        print(f"Start parsing {row[0]} ...", end='')
        make_csv(row[0], 'expansions')
    print('All expansions fetched.')
