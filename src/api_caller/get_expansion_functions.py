import requests
import re
import csv

base_url = 'https://bulbapedia.bulbagarden.net/w/api.php'
params = {
    'action': 'parse',
    'prop': 'sections',
    'format': 'json',
    'section': 3,
    'prop': 'wikitext'
}

def html_to_stringlist(response):
    # remove initial html but looking for col-2 when followed by col-2
    # removing the lookahead returns the japanese set
    res = re.sub(r'[\s\S]+\{{col-2}}\n(?=[\s\S]+{{col-2}})', '', response)
    
    #catch cases where there is no japanese equiv
    res = re.sub('==Set list==\n', '', res)
    
    # remove footer html
    res = re.sub(r'\n{{Setlist/nmfooter[\s\S]+', '', res) 
 
    # split rows into entries
    res = res.split('\n')
    # remove header
    res.pop(0)
    return res

def row_to_data(row, setName):
    try:
        # get the element after the set name bounded by ||
        card_title = re.search(rf'(?<={setName}\|)[^\|]+', row).group(0)
    except:
        # this is why consistent formatting matters
        try:
            # first encountered in Gym Heroes
            card_title = re.search(rf'(?:{setName} \d+\)\|)([^\|\]]+)', row).group(1)
        except:
            # first encountered in Neo Genesis
            print(row)
            card_title = re.search(r'(?<=TCG\|)[^\|\}]+', row).group(0)
        
    try:
        # get the element following [number]}}|
        card_type = re.search(r'(?<=\d}}\|)[^|]+(?:|)', row).group(0)   
    except:
        # this is why consistent formtting matters
        try:
            # first encountered in Gym Heroes
            card_type = re.search(r'(?<=\]\]\|)[^|]+(?:|)', row).group(0) 
        except:
            # first encountered in Neo Genesis
            print(row)
            card_type = re.search(r'(?<=\}\}\|)[^|]+(?:|)', row).group(0)
    
    # get the last element bounded by | and ending in }+
    # one or more } is set as the ending, because there are
    # format issues is some of the tables, e.g. Team Rocket
    # also allow for spaces as in Gym Challenge
    card_rarity = re.search(r'(?<=\|)[^|}]+(?=}+\s*$)', row).group(0)

    # handle the nidorans
    card_title = card_title.replace('♂', '(m)')
    card_title = card_title.replace('♀', '(f)')

    # convert card color type to pokemon
    if card_type not in ['Energy', 'Trainer']:
        # Make sure fossils are trainers
        if re.search('Fossil', card_title) is not None:
            card_type = 'Trainer'
        else:
            card_type = 'Pokémon'
    # convert energy with rarity to special energy
    elif card_type == 'Energy' and card_rarity != 'None':
        card_type = 'Special Energy'
    
    # catch secret rares
    printNums = re.search(r'(?:|)(\d+)/(\d+)(?:|)', row)
    
    # standard cards with #/#    
    try:
        if int(printNums.group(1)) > int(printNums.group(2)):
            card_rarity = 'Secret Rare'
        subset = False
    
    # subsets in collections with letters in the print count
    except:
        # card varients
        printNums = re.search(r'(?:|)([a-zA-Z]+\d+)/([a-zA-Z]\d+)(?:|)', row)
        if printNums is None:
            printNums = re.search(r'(?:|)(\d+[a-zA-Z]+)/(\d+)(?:|)', row)
            subset = printNums.group()
            if int(re.sub('[a-zA-Z]+', '', printNums.group(1))) > int(printNums.group(2)):
                card_rarity = 'Secret Rare'

        # internal subset
        else:
            subset = True
    
    return {
        'card_title': card_title,
        'card_type': card_type,
        'card_rarity': card_rarity,
        'subset': subset
        }

def dedup_prints(cards):
    cards = cards.copy()
    already_found = list()
 
    # is a card has a special subset, and its title is not in already found, mark as not subset
    for card in cards:
        if card['subset'] not in [True, False] and card['card_title'] not in already_found: 
            already_found.append(card['card_title'])
            card['subset'] = False
    return cards
    
def make_csv(setName):
    params['page'] = f"{setName} (TCG)"
    
    # controlling for inconsitencies in bulbapedia
    if setName == 'Expedition':
        params['page'] = f"{setName} Base Set (TCG)"
        
    try:
        res = requests.get(base_url, params=params).json()['parse']['wikitext']['*']
    except:
        print(f"Cound not find set {setName}.")
        return
    
    card_entries = html_to_stringlist(res)
    cards = [row_to_data(card, setName) for card in card_entries]
    
    # handle subsets
    if any([card['subset'] for card in cards]):
        subsetName = input(f"{setName} contains an internal subset.  What should the subset be called?")
        with open(f"{setName} {subsetName}.csv", 'w', encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            for card in cards:
                if card['subset'] == True:
                    writer.writerow([card['card_title'], card['card_type'], card['card_rarity']])
    
    # remove special print notes
    cards = dedup_prints(cards)
    
    # write the main set
    with open(f"{setName}.csv", 'w', encoding="utf-8", newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        for card in cards:
            if card['subset'] == False:
                writer.writerow([card['card_title'], card['card_type'], card['card_rarity']])
    print(f"Finished writing csv for set {setName}.")
