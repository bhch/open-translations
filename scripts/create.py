"""Script for generating new translation files.
"""

import os
import argparse
import sys
import re

sys.path.append(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'lib'))

from ruamel.yaml import YAML

yaml = YAML()
yaml.default_flow_style = False
yaml.indent(mapping=2, sequence=2, offset=2)
yaml.preserve_quotes = True
yaml.sort_base_mapping_type_on_output = False
yaml.allow_duplicate_keys = True


BASE_DIR =  os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TRANSLATIONS_DIR = os.path.join(BASE_DIR, 'translations')


def remove_unwanted_keys(data):
    out_str = re.sub(r'\s*similar:.*\n(\s*-.*)*', '', data)
    out_str = re.sub(r'\s*variants:.*\n(\s{4,}.*:.*)*', '', out_str)
    out_str = re.sub(r'tags:.*\n(\s*-.*)*', 'value:', out_str)
    return out_str


def create_translation_file(code, name, direction, replace):
    en_filepath = os.path.join(TRANSLATIONS_DIR, 'en.yaml')
    out_filename = '%s.yaml' % code
    out_filepath = os.path.join(TRANSLATIONS_DIR, out_filename)

    # Check if a file already exists
    if os.path.exists(out_filepath) and not replace:
        print("\nERROR: A translation file with the name '%s' already exists." % out_filename)
        print("If you want to replace it, run this command with the --replace argument")
        return

    with open(en_filepath, 'r') as en_file:
        out_str = remove_unwanted_keys(en_file.read())

        out_yaml = yaml.load(out_str)

        out_yaml['_meta']['name'] = name
        out_yaml['_meta']['code'] = code
        out_yaml['_meta']['direction'] = direction

    with open(out_filepath, 'w') as out_file:
        yaml.dump(out_yaml, stream=out_file)

    print("\nCreated new translation file %s" % out_filename)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Create a translations skeleton.')
    parser.add_argument('--code', type=str, required=True,
                        help='language code (required)')
    parser.add_argument('--name', type=str, required=True,
                        help='name of the language (required)')
    parser.add_argument('--direction', type=str,
                        choices=['ltr', 'rtl'], default='ltr',
                        help='language direction (default ltr)')
    parser.add_argument('--replace', action='store_true',
                        help='replace a file if already exists')
    args = parser.parse_args()

    create_translation_file(code=args.code, name=args.name, 
        direction=args.direction, replace=args.replace)