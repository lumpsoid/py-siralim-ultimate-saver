import re

class Line():
    ENCRYPTION_KEY = "QWERTY"
    stacirt_number = re.compile(r'[0-9]+')

    def __init__(self, line: str) -> None:
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
