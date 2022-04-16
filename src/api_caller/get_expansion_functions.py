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

def html_to_stringlist(response, subset):
    # remove initial html by looking for col-2 when followed by col-2
    # removing the lookahead returns the last japanese set (if there is one)
    
    res = re.sub(r'[\s\S]+\{{[c|C]ol-2}}\n(?=[\s\S]+{{[c|C]ol-2}})', '', response)

    #catch cases where there is no japanese equiv
    res = re.sub(r'(==)(Set|Card|Deck)( lists?==\n)', '', res)

    #catch Diamond and Pearl's idk-what's-going-on formatting error
    res = re.sub(r'[\s\S]+\n\|\n', '', res)
    
    if not subset:
        # remove footer html
        res = re.sub(r'\n+{{Setlist/n?m?footer[\s\S]+', '', res)
    else:
        res = re.findall(r'({{Setlist/nmheader[\s\S]+?(?=\n{{Setlist/?n?mfooter))', res)[1]

    # split rows into entries
    res = res.split('\n')

    # remove header
    res.pop(0)
    return res

def row_to_data(row, setName):
    print_special = ''
    # row is returned here because any "special" info is parsed from
    # the row so it doesn't interfere with getting the type
    card_title, row = get_title(row, setName)
    card_type = get_type(row)


    # ***Watch the order below; some checks require multiple, pre-cleaned card properties***

    # convert all color types to pokemon
    if card_type not in ['Energy', 'Trainer']:

        # Make sure fossils are trainers, not pokemon
        if re.search('Fossil', card_title) is not None:
            card_type = 'Trainer'

        # make sure tag team pokemon are marked as special
        elif re.search('&', card_title) is not None:
            card_type = 'Special Pokémon'
            card_title = clean_card_title(card_title)

        else:
            card_type = 'Pokémon'
            card_title = clean_card_title(card_title)
    # requires the a fully cleaned title
    card_rarity = get_rarity(row, card_title)
    # convert energy with non-common rarity to special energy
    if card_type == 'Energy' and card_rarity not in ['None', 'Common']:
        card_type = 'Special Energy'
    
    # find secret rares and subsets to mark them as such
    printNums = re.search(r'(?:|)(\d+)/(\d+)(?:|)', row)
    
    # standard cards with #/#
    try:
        if int(printNums.group(1)) > int(printNums.group(2)):
            card_rarity = 'Secret Rare'
        subset = False
    
    # subsets in collections with letters in the print count
    except:
        # special print varients
        printNums = re.search(r'(?:|)([a-zA-Z]+\d+)/([a-zA-Z]\d+)(?:|)', row)
        if printNums is None:
            # first check for alternates. with the format #[a-z].  I believe these only exist
            # for aquapolis and skyridge where the same card art could come with one of two
            # dot codes
            printNums = re.search(r'(?:|)(\d+[a-zA-Z]+)/(\d+)(?:|)', row)
            if printNums is not None:
                subset = printNums.group()
                if int(re.sub('[a-zA-Z]+', '', printNums.group(1))) > int(printNums.group(2)):
                    card_rarity = 'Secret Rare'
            else:
                # get 4 shiny rares
                check1 = re.search(r'((SH|SL)\d+)', row)
                # get promos from any gen (hopefully)
                check2 = re.search(r'(p|P)romo', row)
                # gen 4 alpth lithographs
                check3 = re.search(r'\|\s*([A-Z]{3,5})}}', row)
                if check1 is not None:
                    card_rarity = 'Secret Shiny'
                    print_special = check1.group()
                elif check2 is not None:
                    card_rarity = 'Promo'
                elif check3 is not None:
                    card_rarity = 'Alph Lithograph'
                    print_special = check2.group(1)
                subset = False

        # internal subset (Aquapolis and Skyridge holos)
        else:
            subset = True
    
    return {
        'card_title': card_title.strip(),
        'card_type': card_type,
        'card_rarity': card_rarity,
        'subset': subset,
        'print_special': print_special
        }

def get_title(row, setName):
    try:
        # get the element after the set name bounded by ||
        card_title = re.search(rf'(?<={setName}\|)[^\|]+', row).group(0)
    except:
        # this is why consistent formatting matters
        try:
            # very common alterate in gen 5+ sets
            card_title = re.search(rf'\[\[(.*?)(?:\({setName})', row).group(1)
        except:
            try:
                # first encountered in Gym Heroes
                card_title = re.search(rf'(?:{setName}\s?\d+\)\|)([^\|\]]+)', row).group(1)
            except:
                try:
                    # first encountered in Neo Genesis
                    card_title = re.search(r'(?<=TCG\|)[^\|\}]+', row).group(0)
                except:
                    try:
                        # deck lists
                        card_title = re.search(r'(TCG ID\|)[^\|]+(\|)([^\|]+)', row).group(3)
                    except:
                        card_title = re.search(r'[^\|]+(\|\[\[)([^\|\]]+)', row).group(2)
    # get special info about card and add to title
    special = re.search(r"<small>'''([^|]*)'{0,3}(</small>)?", row)
    if special is not None:
        # don't add if it's a team galactic tool or has multiple classifications (i.e. XY Vivillon)
        if not bool(re.search('<', special.group())) and not bool(re.search('Galactic', special.group())):
            card_title = f"{card_title} ({special.group(1)})"
        row = re.sub(r"<small>'''([^|]*)'{0,3}(</small>)?", '', row)
    return card_title, row

def get_type(row):
    try:
        # get the element following [number]}}|
        card_type = re.search(r'(?<=\d}})\s*\|([^|]+)(?:|)', row).group(1)   
    except:
        # this is why consistent formatting matters
        try:
            # first encountered in Gym Heroes
            card_type = re.search(r'(?<=\]\]\|)[^|]+(?:|)', row).group(0) 
        except:
            # first encountered in Neo Genesis
            card_type = re.search(r'(?<=\}\}\|)[^|]+(?:|)', row).group(0)

    # convert more descriptive trainer types in modern sets to just trainer
    if card_type in ['Item', 'Stadium', 'Supporter']:
        card_type = 'Trainer'
    
    return card_type

def get_rarity(row, card_title):
    # get the last element bounded by | and ending in
    # one or more } with set as the ending, because there are
    # format issues is some of the tables, e.g. Team Rocket
    # also allow for accidental spaces as in Gym Challenge
    try:
        card_rarity = re.search(r'(?<=\|)[^|}]+(?=\|{0,1}}+\s*$)', row).group(0)
        promo = re.search(r'((c|C)ollection)|((b|B)ox)', card_rarity)
        # covers decks
        if card_rarity.isnumeric():
            card_rarity = 'None'
        elif promo is not None:
            card_rarity = 'Promo'
    except:
        # the Kalos starter set just has blank space...
        card_rarity = 'None'
    card_rarity = clean_card_rarity(card_rarity, card_title)
    return card_rarity

def dedup_prints(cards):
    cards = cards.copy()
    already_found = list()
 
    # if a card has a special subset, and its title is not in already found
    # mark as not subset so it will rite into the final data
    for card in cards:
        if card['subset'] not in [True, False] and card['card_title'] not in already_found: 
            already_found.append(card['card_title'])
            card['subset'] = False
    return cards
    
def clean_card_title(title):
    # # handle the nidorans
    # title = title.replace('♂', '(m)')
    # title = title.replace('♀', '(f)')

    # gen 3
    # title = re.sub(r'([a-z])(\s?Star)', lambda match: f"{match.group(1)} Goldstar", title)

    # gen 4
    title = re.sub(r'([a-zA-Z])\s(4)', lambda match: f"{match.group(1)} Elite Four", title)

    # fix EX era
    title = re.sub(r'(Mega\s?)([A-Z])', lambda match: f"Mega {match.group(2)}", title)
    title = re.sub(r'([a-z])(\s?-?EX)', lambda match: f"{match.group(1)} EX", title)
    title = re.sub(r'([a-z])(\s?BREAK)', lambda match: f"{match.group(1)} BREAK", title)

    # gen 7
    title = re.sub(r'([a-z])(\s?-?GX)', lambda match: f"{match.group(1)} GX", title)
    title = re.sub(r'([a-z])(\s?Tag Team)', lambda match: f"{match.group(1)} Tag Team", title)

    # Gen 8
    title = re.sub(r'([a-z])(\s?VMAX)', lambda match: f"{match.group(1)} VMAX", title)
    title = re.sub(r'([a-z])(\s?V)', lambda match: f"{match.group(1)} V", title)
    return title.strip()

def clean_card_rarity(rare, title):
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

def seek_set_list(setName):
    seek_params = {
            'action': 'parse',
            'prop': 'sections',
            'format': 'json',
            'page': params['page']
        }
    sections = requests.get(base_url, params=seek_params).json()['parse']['sections']
    for sec in sections:
        if sec['line'].lower() in ['set lists', 'set list',
        'card list', 'card lists', 'deck list', 'deck lists']:
            return sec['index']
    raise ValueError(f"Set {setName} does not yet have a set list on Bulbapedia.  Try again in a few weeks.")

def make_csv(setName, path, subset = ''):
    params['page'] = f"{setName} (TCG)"
    
    # controlling for inconsitencies in bulbapedia
    if setName == 'Expedition':
        params['page'] = f"Expedition Base Set (TCG)"
    elif setName == 'Arceus':
        params['page'] = 'Platinum: Arceus (TCG)'

    # Get the data
    try:
        res = requests.get(base_url, params=params).json()['parse']['wikitext']['*']
    except:
        if re.search('Promo', setName):
            params['section'] = 1
            try:
                res = requests.get(base_url, params=params).json()['parse']['wikitext']['*']
            except:
                print(f"Could not find set {setName}.")
                return
        else:
            print(f"Could not find set {setName}.")
            return


    # make sure it is the set list
    try:
        re.search(r'==(Set)|(Card)|(Deck) list', res).group()
    # if not, is means that there are the wrong number of sections on the page :/
    # find the correct section number instead, and then try again
    except:
        params['section'] = seek_set_list(setName)
        res = requests.get(base_url, params=params).json()['parse']['wikitext']['*']

    card_entries = html_to_stringlist(res, subset != '')

    # more bulapedia nconsistencies
    setName = setName.replace('Black Star Promos', 'Promo')

    card_sets = []
    try:
        # halfdeck kits
        if '{{Halfdecklist/nmfooter}}' in card_entries:
            split = card_entries.index('{{Halfdecklist/nmfooter}}')
            deck1 = card_entries[0:split]
            deck2 = card_entries[split + 3:len(card_entries) - 2]

            card_sets.append([row_to_data(card, setName) for card in deck1])
            card_sets.append([row_to_data(card, setName) for card in deck2])
        else:
            card_sets.append([row_to_data(card, setName) for card in card_entries])
    except:
        # print(f"There is some formatting error in the data not yet covered by the cleaning script. See parsed response text below...\n {card_entries}")
        return

    i = 0
    output_name = setName if subset == '' else f"{setName}-{subset}"
    for cards in card_sets:
        write_sets(cards, output_name, path, 'w' if i == 0 else 'a')
        i += 1
    
    print(f"Finished writing csv for set {setName}.")

def write_sets(cards, setName, path, mode = 'w'):
    # handle subsets
    if any([card['subset'] for card in cards]):
        print(f"{setName} contains an internal subset.  The subset will be called {setName} Holos")
        with open(f"{path}/{setName} Holos.csv", 'w', encoding="utf-8", newline='') as csvfile:
            writer = csv.writer(csvfile, delimiter=',')
            for card in cards:
                if card['subset'] == True:
                    writer.writerow([card['card_title'], card['card_type'], card['card_rarity'], card['print_special']])
    
    # remove special print notes
    cards = dedup_prints(cards)
    
    # write the main set
    with open(f"{path}/{setName}.csv", mode, encoding="utf-8", newline='') as csvfile:
        writer = csv.writer(csvfile, delimiter=',')
        for card in cards:
            if card['subset'] == False:
                writer.writerow([card['card_title'], card['card_type'], card['card_rarity'], card['print_special']])