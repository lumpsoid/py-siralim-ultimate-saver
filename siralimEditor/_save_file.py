#!/bin/python
import os
import subprocess
import sys
from typing import Union

from ._data import knowledge, creature_ids, creature_template
from ._utils import enumerate_generator
from ._line import Line


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
    

    def encription_check(self) -> bool:
        if '\x9a' in self.text[0].key or '\x9a' in self.text[1].key:
            return False
        else:
            return True
    

    def format_save_file(self) -> str:
        changed_text = ''
        for line in self.text:
            changed_text += line.format_save()
        return changed_text


    def save(self, path_to_output=None) -> None:
        if path_to_output is None:
            path_to_output = self.path_to_file
            if self.encription_check():
                path_to_output = f'{path_to_output}.decoded.txt'
            else:
                path_to_output = f'{path_to_output}.sav'
        
        self.changed_text = self.format_save_file()
        
        with open(path_to_output, 'w', encoding='utf-8') as f:
            f.write(self.changed_text)
        if not 'tmp' in path_to_output:
            sys.stdout.write(f'Save location is -> {path_to_output}\n')
    
    
    def transform(self, encrypt=None) -> None:
        if encrypt is None:
            encrypt = self.encription_check()
        
        for line in self.text:
            line.transform(encrypt)
    

    def find_line(self, type: str, key: str, value: Union[str, None] = None) -> tuple[int, Line]:
        generator = enumerate_generator(self.text)
        try:
            while True:
                index, line = next(generator)
                if line.type != type:
                    continue
                elif key not in line.key:
                    continue
                elif value and value not in line.value:
                    continue
                return index, line
        except StopIteration:
            sys.stdout.write(f"Key={key} was not founded.\nGenerator ended.\n")
            raise
    

    def add_summon(self, nickname=None) -> None:
        if nickname is None:
            raise ValueError("Creature Nickname is needed")
        
        id = int(self.get_creature_id(nickname))
        _, line = self.find_line(type='pair', key='Summon')
        summon_array = line.value.split(',')
        summon_array[id] = '100'
        line.value = ','.join(summon_array)


    def add_knowledge(self, nickname=None, knowledge='4000') -> None:
        if nickname is None:
            raise ValueError("Creature ID is needed")

        id = self.get_creature_id(nickname)
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
            knowledge_array.append(knowledge)
        else:
            i *= 2
            knowledge_array[i+1] = knowledge
        line.value = ','.join(knowledge_array)


    def search_id(self, name) -> str:  # currently 
        i, line = self.find_line(type='pair', key='Nickname', value=name)        
        nickname = line.value
        line = self.text[i+1]
        sys.stdout.write(f"ID of the {nickname}={line.value}\n")
        return line.value


    def add_material(self, quantity) -> None:
        for _, line in enumerate(self.text):
            if line.type != 'pair':
                continue
            if line.key == "MaterialQuantity":
                line.value = str(quantity)
    

    def add_dust(self, quantity) -> None:
        for _, line in enumerate(self.text):
            if line.type != 'pair':
                continue
            if line.key == "DustQuantity":
                line.value = str(quantity)
    

    def get_creature_id(self, nickname: str) -> str:
        id = creature_ids.get(nickname)
        if id is None:
            raise ValueError(f"ID of the {nickname} is missing.")
        
        sys.stdout.write(f"ID of the {nickname}={id}\n")
        return id


    def get_block_number(self, key: str) -> tuple[int, int]:  # [StaCrit<21>]  21 <- number
        i, line = self.find_line(type='block_name', key=key)
        number = int(line.key[len(key):])
        return i, number


    def add_creature(self, nickname=None, personality=None):
        if personality is None:
            raise ValueError(f"Personality ID is missing.")
        id = self.get_creature_id(nickname)
        if id is None:
            raise ValueError(f"ID of the {nickname} is missing.")
        
        guid = 0
        last_sta_crit_index = None
        generator = enumerate_generator(self.text)
        for i, line in generator:
            if line.type == 'pair':
                if 'NumStaCrits' == line.key:
                    sta_crit_num = int(line.value) + 1
                    num_sta_crit_index = i
                elif 'GUID' == line.key:
                    value = int(line.value)
                    guid = value if guid < value else guid
            elif line.type == "block_name" and last_sta_crit_index is None:
                if 'StaCrit' in line.key:
                    last_sta_crit_index = i

        self.text[num_sta_crit_index].value = str(sta_crit_num)

        creature_data = []
        creature_data.append(Line(f'[StaCrit{sta_crit_num}]'))
        for k, v in creature_template.items():
            if v is None:
                if k == "Personality":
                    v = personality
                elif k == "Nickname":
                    v = nickname
                elif k == "Constant":
                    v = id
                elif k == "GUID":
                    v = guid
            creature_data.append(Line(f'{k}="{v}"'))
        
        self.text[last_sta_crit_index:last_sta_crit_index] = creature_data


    def edit_file(self, editor: str) -> None:
        origianl_path = self.path_to_file
        tmp_file_path = '/tmp/siralim_save_file.txt'
        self.save(path_to_output=tmp_file_path)

        cmd = [editor, '/tmp/siralim_save_file.txt']
        subprocess.run(cmd)
        
        self.__init__(tmp_file_path)
        self.path_to_file = origianl_path
        os.remove(tmp_file_path)
