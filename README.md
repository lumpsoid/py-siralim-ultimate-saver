# CLI tool for working with the Siralim Ultimate save file
This is simply a rewritten code of the [gurgalex/SiralimUltimateSaver](https://github.com/gurgalex/SiralimUltimateSaver) website version for local command-line interface (CLI) usage in Python.

## Installation

Linux:
```
git clone https://github.com/lumpsoid/py-siralim-ultimate-saver.git
cd py-siralim-ultimate-saver
chmod +x py-siralim-ultimate-save.py
```

## Usage
```
siralimctl.py --file /path/to/encripted/save --encode
siralimctl.py --file /path/to/decripted/save --decode
siralimctl.py --file /path/to/decripted/save --get-id 'Mimic'
siralimctl.py --file /path/to/decripted/save --mana --name 'Mimic'
siralimctl.py --file /path/to/decripted/save --knowledge --name 'Mimic'
siralimctl.py --help
```

you also can chain parameters:
```
siralimctl.py -tmkCf /path/to/encripted/save/file --name 'Mimic' --personality 15
```
in this line Mimic will get S tear knowledge, get 100 mana for summoning, and you character will get 1 copy of Mimic with 15'th personality, and final file would be already encrypted and ready to load in game.

## CTL Options
```
options:
  -h, --help            show this help message and exit
  -f PATH, --file PATH  file to use
  -e, --encript         Encrypt a save file.
  -d, --decript         Decrypt a save file.
  -t, --transform       Auto define state of the save file and decript/encript accordingly
  -m, --mana            Adding mana for creature summoning.
  -k, --knowledge       Add knowledge experience to creature
  -n NAME, --name NAME  Creature's Nickname
  -o PATH, --out PATH   Location where to put output file. (with file name)
  --get-id NAME         Get ingame id of the creature.
  --add-materials QUANTITY
                        Add quantity to all materials in your possesion.
  --add-dust QUANTITY   Add quantity to all dust in your possesion.
  -E EDITOR, --editor EDITOR
                        Edit decoded file.
  -C, --add-creature    Add creature to your withdraw list.
  -P ID, --personality ID
                        Choose personality id for your creature.
```
