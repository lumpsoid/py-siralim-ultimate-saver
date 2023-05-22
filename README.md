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
py-siralim-ultimate-save.py --file /path/to/encripted/save --encode
py-siralim-ultimate-save.py --file /path/to/decripted/save --decode
py-siralim-ultimate-save.py --file /path/to/decripted/save --search-id 65
py-siralim-ultimate-save.py --file /path/to/decripted/save --mana --id 65
py-siralim-ultimate-save.py --file /path/to/decripted/save --knowledge --id 65
py-siralim-ultimate-save.py --help
```
