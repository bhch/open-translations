"""Script for updating translation files with new terms.

New terms are first added to English (en.yaml) file. This script adds those 
new terms to other translation files.
"""

import os
import io
import re
import argparse
from create import yaml, remove_unwanted_keys, TRANSLATIONS_DIR


def update_translation_files(f_name, update_all):
    if not f_name and not update_all:
        return

    if f_name and not os.path.exists(os.path.join(TRANSLATIONS_DIR, f_name)):
        print("\nERROR: File '%s' doesn't exist" % f_name)
        return

    for filename in os.listdir(TRANSLATIONS_DIR):
        if f_name and filename != f_name:
            continue

        if filename == 'en.yaml':
            continue

        en_fp = os.path.join(TRANSLATIONS_DIR, 'en.yaml')
        out_fp = os.path.join(TRANSLATIONS_DIR, filename)

        with open(out_fp, 'r') as out_file:
            old_yaml = yaml.load(out_file)

        with open(en_fp, 'r') as en_file:
            out_str = remove_unwanted_keys(en_file.read())
            new_yaml = yaml.load(out_str)

        for term in old_yaml:
            for key in old_yaml[term]:
                try:
                    if (key == 'description'):
                        continue
                    new_yaml[term][key] = old_yaml[term][key]
                except KeyError:
                    pass

        out_yaml = io.StringIO()
        yaml.dump(new_yaml, stream=out_yaml)

        # replace extra blank lines
        out_str = re.sub(r'^\s*$', '', out_yaml.getvalue(), flags=re.MULTILINE)

        with open(out_fp, 'w') as out_file:
            out_file.write(out_str)

    if (f_name):
        print("\nUpdated file %s" % f_name)
    else:
        print("\nUpdated files.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Update translation files with new terms.')
    group = parser.add_mutually_exclusive_group()
    group.add_argument('--filename', type=str,
                        help='name of the file to update')

    group.add_argument('--all', action='store_true',
                        help='update all files')
    args = parser.parse_args()

    if not args.filename and not args.all:
        parser.print_help()
    else:
        update_translation_files(f_name=args.filename, update_all=args.all)