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
    # print(response)
    res = re.sub(r'[\s\S]+\{{col-2}}\n(?=[\s\S]+{{col-2}})', '', response)
    
    #catch cases where there is no japanese equiv
    res = re.sub('==Set list==\n', '', res)

    #catch Diamond and Pearl's idk-what's-going-on formatting error
    res = re.sub(r'[\s\S]+\n\|\n', '', res)
    
    # remove footer html
    res = re.sub(r'\n{{Setlist/n?m?footer[\s\S]+', '', res) 
 
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
            # very common in the gen 5+ sets
            card_title = re.search(rf'\[\[(.*?)(?:\({setName})', row).group(1)
        except:
            try:
                # first encountered in Gym Heroes
                card_title = re.search(rf'(?:{setName}\s?\d+\)\|)([^\|\]]+)', row).group(1)
            except:
                # first encountered in Neo Genesis
                # print(f"Title exception: {row}")
                card_title = re.search(r'(?<=TCG\|)[^\|\}]+', row).group(0)
    
    # get special info about card
    special = re.search(r"<small>'''(.*)'''</small>", row)
    if special is not None:
        card_title = f"{card_title} ({special.group(1)})"
        row = re.sub(r"<small>'''(.*)'''</small>", '', row)
    try:
        # get the element following [number]}}|
        card_type = re.search(r'(?<=\d}})\s*\|([^|]+)(?:|)', row).group(1)   
    except:
        # this is why consistent formtting matters
        try:
            # first encountered in Gym Heroes
            card_type = re.search(r'(?<=\]\]\|)[^|]+(?:|)', row).group(0) 
        except:
            # first encountered in Neo Genesis
            # print(f"Type exception: {row}")
            card_type = re.search(r'(?<=\}\}\|)[^|]+(?:|)', row).group(0)


    # Do this before doing the rarity check, because the rarity check depends
    # on the titles being fixed!!!
    # convert card color type to pokemon
    if card_type not in ['Energy', 'Trainer']:
        # Make sure fossils are trainers
        if re.search('Fossil', card_title) is not None:
            card_type = 'Trainer'
        else:
            card_type = 'Pokémon'
            card_title = clean_card_title(card_title)
    
    # get the last element bounded by | and ending in }+
    # one or more } is set as the ending, because there are
    # format issues is some of the tables, e.g. Team Rocket
    # also allow for spaces as in Gym Challenge
    card_rarity = re.search(r'(?<=\|)[^|}]+(?=\|*}+\s*$)', row).group(0)
    card_rarity = clean_card_rarity(card_rarity, card_title)



    # convert energy with rarity to special energy
    if card_type == 'Energy' and card_rarity not in ['None', 'Common']:
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
            if printNums is not None:
                subset = printNums.group()
                if int(re.sub('[a-zA-Z]+', '', printNums.group(1))) > int(printNums.group(2)):
                    card_rarity = 'Secret Rare'
            else:
                # print(f"Subset exception: {row}")
                if re.search(r'([SH|SL]\d+)', row) is not None:
                    card_rarity = 'Secret Shiny'
                elif re.search(r'\|\s*([A-Z]{3,5})}}', row) is not None:
                    card_rarity = 'Alph Lithograph'
                subset = False

        # internal subset
        else:
            subset = True
    
    return {
        'card_title': card_title.strip(),
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
    
def clean_card_title(title):
    # handle the nidorans
    title = title.replace('♂', '(m)')
    title = title.replace('♀', '(f)')

    # gen 3
    title = re.sub(r'([a-z])(\s?Star)', lambda match: f"{match.group(1)} Goldstar", title)

    # fix EX era
    title = re.sub(r'(Mega\s?)([A-Z])', lambda match: f"Mega {match.group(2)}", title)
    title = re.sub(r'([a-z])(\s?EX)', lambda match: f"{match.group(1)} EX", title)
    title = re.sub(r'([a-z])(\s?BREAK)', lambda match: f"{match.group(1)} BREAK", title)

    # gen 7
    title = re.sub(r'([a-z])(\s?-?GX)', lambda match: f"{match.group(1)} GX", title)
    title = re.sub(r'([a-z])(\s?Tag Team)', lambda match: f"{match.group(1)} Tag Team", title)

    # Gen 8
    title = re.sub(r'([a-z])(\s?VMAX)', lambda match: f"{match.group(1)} VMAX", title)
    title = re.sub(r'([a-z])(\s?V)', lambda match: f"{match.group(1)} V", title)
    return title.strip()

def clean_card_rarity(rare, title):
    print(title)
    rare = re.sub(r'Rare Holo\s*ex', 'EX', rare)
    rare = re.sub(r'Rare Holo\s*LV.X', 'LV.X', rare)
    rare = re.sub(r'Rare Holo\s*LEGEND', 'LEGEND', rare)
    rare = re.sub(r'Rare Ultra', 'Full Art', rare)
    rare = re.sub(r'Rare BREAK', 'BREAK', rare)

    #Ultra rare replacement
    ur = re.search('\s([a-zA-Z]+)\s?$', title)
    if ur is not None:
        rare = re.sub(r'Ultra-Rare Rare', ur.group(1), rare)

    # get Prism Stars
    if bool(re.search('♢', title)):
        rare = 'Prism Star'
    
    rare = re.sub(r'ShinyRare Holo', 'Goldstar', rare)
    rare = re.sub(r'^A$', 'Amazing Rare', rare)
    return rare

def make_csv(setName, path):
    params['page'] = f"{setName} (TCG)"
    
    # controlling for inconsitencies in bulbapedia
    if setName == 'Expedition':
        params['page'] = f"Expedition Base Set (TCG)"
    elif setName == 'Arceus':
        params['page'] = 'Platinum: Arceus (TCG)'
        
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
        with open(f"{path}/{setName} {subsetName}.csv", 'w', encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            for card in cards:
                if card['subset'] == True:
                    writer.writerow([card['card_title'], card['card_type'], card['card_rarity']])
    
    # remove special print notes
    cards = dedup_prints(cards)
    
    # write the main set
    with open(f"{path}/{setName}.csv", 'w', encoding="utf-8", newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        for card in cards:
            if card['subset'] == False:
                writer.writerow([card['card_title'], card['card_type'], card['card_rarity']])
    print(f"Finished writing csv for set {setName}.")
