#!/bin/python
import re
import argparse
import os
import sys


class Line():
    ENCRYPTION_KEY = "QWERTY"

    def __init__(self, line):
        self.line = line.replace('\n', '')
        
        if self.line[0] == '[':
            self.type = 'block_name'
            self.key = self.line[1:-1]
            self.value = None
        elif self.line[-1] == '"':
            self.type = 'pair'
            self.key, self.value = self.line.split('=')
            self.value = self.value[1:-1]
        else:
            self.type = 'null'
            self.key, self.value = None, None

    
    def __str__(self):
        return f'{self.line}'
    

    def __repr__(self):
        return f'{self.line}'
    

    def encryption(self, value, encrypt):
        if len(value) == 0:
            return ''
        output = []
        KEY_MAX_INDEX = len(Line.ENCRYPTION_KEY)
        
        for index, c in enumerate(value):
            CodePointInput = ord(c)
            codePointKey = ord(Line.ENCRYPTION_KEY[index % KEY_MAX_INDEX])
            
            if encrypt:
                output_char = chr(CodePointInput + codePointKey)
            else:
                output_char = chr(CodePointInput - codePointKey)
            
            output.append(output_char)
        
        return ''.join(output)
        

    def transform(self, encrypt):
        if self.type == "null":
            return
        elif self.type == "block_name":
            self.key = self.encryption(self.key, encrypt)
            # self.line = f'[{self.key}]\n'
        elif self.type == "pair":
            self.key = self.encryption(self.key, encrypt)
            self.value = self.encryption(self.value, encrypt)
            # self.line = f'{self.encryption(self.key, encrypt)}="{self.encryption(self.value, encrypt)}"\n'
    

    def format_save(self):
        if self.type == "null":
            return ''
        if self.type == "block_name":
            return f'[{self.key}]\n'
        elif self.type == "pair":
            return f'{self.key}="{self.value}"\n'


def enumerate_generator(sequence):
        for index, item in enumerate(sequence):
            yield index, item


class SaveFile():
    def __init__(self, path_to_file, encripting=None):
        try:
            with open(path_to_file, 'r', encoding='utf-8') as f:
                text = list(map(Line, f))
            self.text = text

            if encripting is None:
                self.encripting = self.encription_check()
            else:
                self.encripting = encripting
                check = self.encription_check()
                if check != self.encripting:
                    sys.stdout.write("It's seems you are trying decript/encript a decripted/encripted file?\n")
            
            self.path_to_file = path_to_file
            self.changed_text = None 
        
        except IOError:
            sys.stdout.write("Error reading file\n")
    

    def encription_check(self):
        if '\x9a' in self.text[0].key or '\x9a' in self.text[1].key:
            return False
        else:
            return True
    

    def save(self, path_to_output=None):
        if path_to_output is None:
            path_to_output = self.path_to_file
            if self.encription_check():
                path_to_output = f'{path_to_output}.decoded.txt'
            else:
                path_to_output = f'{path_to_output}.sav'
        
        self.changed_text = ''
        for line in self.text:
            self.changed_text += line.format_save()
        
        with open(path_to_output, 'w', encoding='utf-8') as f:
            f.write(self.changed_text)
        sys.stdout.write(f'Save location is -> {path_to_output}\n')
    
    
    def transform(self, encrypt=None):
        if encrypt is None:
            encrypt = self.encripting
        
        for line in self.text:
            line.transform(encrypt)
    

    def find_line(self, type: str, key: str, value: str = None) -> Line:
        generator = enumerate_generator(self.text)
        try:
            while True:
                index, line = next(generator)
                if line.type != type:
                    continue
                elif line.key != key:
                    continue
                elif value and value not in line.value:
                    continue
                return index, line
        except StopIteration:
            sys.stdout.write(f"Key={key} was not founded.\nGenerator ended.\n")
            raise
    

    def add_summon(self, id=None) -> None:
        if id is None:
            raise ValueError("Creature ID is needed")
        
        id = int(id)
        _, line = self.find_line(type='pair', key='Summon')
        summon_array = line.value.split(',')
        summon_array[id] = '100'
        line.value = ','.join(summon_array)


    def add_knowledge(self, id=None):
        if id is None:
            raise ValueError("Creature ID is needed")

        id = str(id)
        i, _ = self.find_line(type='block_name', key='Knowledge2')
        line = self.text[i+1]
        knowledge_array = line.value.split(',')
        
        find = 0
        for i, v in enumerate(knowledge_array[::2]):
            if v == id:
                find = 1
                break
        
        if not find:
            knowledge_array.append(id)
            knowledge_array.append('4000')
        else:
            i *= 2
            knowledge_array[i+1] = '4000'
        line.value = ','.join(knowledge_array)


    def search_id(self, name):
        i, line = self.find_line(type='pair', key='Nickname', value=name)        
        nickname = line.value
        line = self.text[i+1]
        sys.stdout.write(f"ID of the {nickname}={line.value}\n")
        return line.value
    

    def add_material(self, quantity):
        for i, line in enumerate(self.text):
            if line.type != 'pair':
                continue
            if line.key == "MaterialQuantity":
                line.value = str(quantity)
    

    def add_dust(self, quantity):
        for i, line in enumerate(self.text):
            if line.type != 'pair':
                continue
            if line.key == "DustQuantity":
                line.value = str(quantity)


def process_actions(args):
    expanded_path = os.path.expanduser(args.file)
    
    if args.encript or args.decript == False:
        if args.encript and args.decript == False:
            raise TypeError('Can not encript and decript in one time')
        elif args.encript:
            save_file = SaveFile(
                path_to_file=expanded_path,
                encripting=args.encript
            )
        elif args.decript == False:
            save_file = SaveFile(
                path_to_file=expanded_path,
                encripting=args.decript
            )
        save_file.transform()
        save_file.save(args.out)
        return
    
    save_file = SaveFile(path_to_file=expanded_path)
    
    if args.mana or args.knowledge or args.search_id or args.add_materials or args.add_dust:
        if save_file.encripting == False:
            save_file.transform()
        
        if args.search_id:
            save_file.search_id(args.search_id)
            return
        if args.mana: 
            save_file.add_summon(args.id)
        if args.knowledge:
            save_file.add_knowledge(args.id)
        if args.add_materials:
            save_file.add_material(args.add_materials)
        if args.add_dust:
            save_file.add_dust(args.add_dust)
    
    if args.transform:
        save_file.transform()
    save_file.save(args.out)



if __name__=="__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "-f", "--file",
        help="file to use",
        metavar='PATH',
        required=True,
    )
    parser.add_argument(
        "-e", "--encript", 
        help="Encrypt a save file.",
        default=None,
        action='store_true',
        required=False
    )
    parser.add_argument(
        "-d", "--decript", 
        help="Decrypt a save file.",
        default=None,
        action='store_false',
        required=False
    )
    parser.add_argument(
        "-t", "--transform", 
        help="Auto define state of the save file and decript/encript accordingly",
        default=None,
        action='store_true',
        required=False
    )
    parser.add_argument(
        "-m", "--mana", 
        help="Adding mana for creature summoning.",
        default=None,
        action='store_true',
        required=False
    )
    parser.add_argument(
        "-k", "--knowledge",
        help="Add knowledge experience to creature", 
        action='store_true',
        default=None,
        required=False
    )
    parser.add_argument(
        "-i", "--id",
        help="Creature's ID", 
        default=None,
        required=False
    )
    parser.add_argument(
        "-o", "--out",
        help="Location where to put output file. (with file name)", 
        metavar='PATH',
        default=None,
        required=False
    )
    parser.add_argument(
        "-s", "--search-id",
        help="Search creature's ID by his Name, you need to have this creature in summoned creatures.", 
        metavar='ID',
        default=None,
        required=False
    )
    parser.add_argument(
        "--add-materials",
        help="Add quantity to all materials in your possesion.",
        metavar='QUANTITY',
        default=None,
        required=False
    )
    parser.add_argument(
        "--add-dust",
        help="Add quantity to all dust in your possesion.",
        metavar='QUANTITY',
        default=None,
        required=False
    )
    args = parser.parse_args()

    process_actions(args)