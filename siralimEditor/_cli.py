import os
import argparse
from ._save_file import SaveFile


def args_init():
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
        "-n", "--name",
        help="Creature's Nickname", 
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
        "--get-id",
        help="Get ingame id of the creature.", 
        metavar='NAME',
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
    parser.add_argument(
        "-E", "--editor",
        help="Edit decoded file.",
        metavar='EDITOR',
        default=None,
        required=False
    )
    parser.add_argument(
        "-C", "--add-creature",
        help="Add creature to your withdraw list.",
        action='store_true',
        default=None,
        required=False
    )
    parser.add_argument(
        "-P", "--personality",
        help="Choose personality id for your creature.",
        metavar='ID',
        default=None,
        required=False
    )
    args = parser.parse_args()
    return args

def process_actions():
    args = args_init()
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
    
    if args.mana or args.knowledge or args.get_id \
        or args.add_materials or args.add_dust or args.editor \
        or args.add_creature:
        
        if save_file.encripting == False:
            save_file.transform()
        
        if args.get_id:
            save_file.get_creature_id(args.get_id)
            return
        if args.mana: 
            save_file.add_summon(args.name)
        if args.knowledge:
            save_file.add_knowledge(args.name)
        if args.add_materials:
            save_file.add_material(args.add_materials)
        if args.add_dust:
            save_file.add_dust(args.add_dust)
        if args.add_creature:
            save_file.add_creature(args.name, args.personality)
        
        if args.editor:
            save_file.edit_file(args.editor)

    if args.transform:
        save_file.transform()
    save_file.save(args.out)

if __name__ == "__main__":
    process_actions()
