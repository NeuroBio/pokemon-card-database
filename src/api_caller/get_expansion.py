import csv
from  get_expansion_functions import make_csv

with open('expansions.csv') as exp:
    reader = csv.reader(exp)
    for row in reader:
        make_csv(row[0])
