import os
import argparse
import json
from create import yaml, TRANSLATIONS_DIR


def convert(destination, no_overwrite, pretty):
    for filename in os.listdir(TRANSLATIONS_DIR):
        in_fp = os.path.join(TRANSLATIONS_DIR, filename)
        out_fp = os.path.join(destination, filename.replace('.yaml', '.json'))

        if os.path.exists(out_fp) and no_overwrite:
            continue
        
        with open(in_fp, 'r') as in_f, open(out_fp, 'w') as out_f:
            in_yaml = yaml.load(in_f)
            out_f.write(json.dumps(
                in_yaml, 
                indent=2 if pretty else None,
                separators=(', ', ': ') if pretty else (',', ':')
                )
            )

    print("\nDone.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Convert translations to JSON for use in website.')
    parser.add_argument('--destination', type=str, required=True,
                        help='path to the destination directory where converted files will be saved')
    parser.add_argument('--no-overwrite', action='store_true',
                        help='prevent overwriting existing files')
    parser.add_argument('--pretty', action='store_true', 
                        help='save in a pretty, indented format')
    args = parser.parse_args()

    convert(destination=args.destination, no_overwrite=args.no_overwrite, pretty=args.pretty)
