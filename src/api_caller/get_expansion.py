import csv
from pathlib import Path
from  get_expansion_functions import make_csv

# get the list of expansions...
with open('expansions.csv') as exp:
    reader = csv.reader(exp)
    for row in reader:

        # skip expansions is a .csv already exists
        if Path(f"expansions/{row[0]}.csv").exists():
            print(f"Skipping {row[0]}")
            continue

        # fetch expansion
        print(f"Start parsing {row[0]} ...", end='')
        make_csv(row[0], 'expansions')

    # announce complete
    print('Finished fetching expansions.')
