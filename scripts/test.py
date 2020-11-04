import os
import sys
import unittest
from create import yaml, remove_unwanted_keys, TRANSLATIONS_DIR 


class TestRemoveUnwantedKeysFunc(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = data = """
        Test term 1:
            description: test description lorem ipsum dolor 
                lorem ipsum dolor  
            tags:
                - test
                - test
            similar:
                - test
                - test
            variants:
                test variant 1:
                test variant 2: test variant info

        Test term 2:
            description: test description
            tags:
                - test 
        """
    def test_output_files_only_have_description_and_variations_keys(self):
        out_str = remove_unwanted_keys(self.data)

        out_yaml = yaml.load(out_str)

        for term in out_yaml:
            for key in out_yaml[term]:
                self.assertIn(key, ['value', 'description'])

    def test_output_file_description_is_same(self):
        """Test that multiline descriptions are unaffected"""
        out_str = remove_unwanted_keys(self.data)

        in_yaml = yaml.load(self.data)
        out_yaml = yaml.load(out_str)

        self.assertEqual(in_yaml['Test term 1']['description'], out_yaml['Test term 1']['description'])


class TestCreateFileFunc(unittest.TestCase):
    def test_doesnt_overwrite_existing_files(self):
        """TODO"""
        pass



class TestTranslationFiles(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.valid_meta_keys = ['code', 'name', 'direction']
        cls.valid_term_keys_en = ['description', 'tags', 'variants', 'similar']
        cls.valid_term_keys_rest = ['description', 'value']

        cls.key_types = {
            'code': str,
            'name': str,
            'direction': str,
            'description': str,
            'tags': list,
            'variants': dict,
            'similar': list,
            'value': (str, dict, type(None)),
        }

        cls.type_names = {
            repr(str): 'string',
            repr(list): 'array',
            repr(dict): 'key-value object',
            repr(type(None)): 'blank/null'
        }

    def get_key_types(self, key):
        return self.key_types[key]

    def get_type_name(self, type):
        return self.type_names[repr(type)]

    def get_type_names_for_key(self, key):
        types = self.get_key_types(key)

        if (isinstance(types, tuple)):
            type_names = [self.get_type_name(key_type) for key_type in types]
        else:
            type_names = [self.get_type_name(types)]

        return type_names

    def test_english_file_validity(self):
        filename = 'en.yaml'

        with open(os.path.join(TRANSLATIONS_DIR, filename)) as f:
            f_yaml = yaml.load(f)
            for term in f_yaml:
                # check for invalid keys
                for key in f_yaml[term]:
                    if term == '_meta':
                        self.assertIn(key, self.valid_meta_keys, 
                            msg='\nInvalid meta key in %s: "%s"' % (filename, key)
                        )
                        continue

                    self.assertIn(key, self.valid_term_keys_en,
                        msg='\nInvalid key in %s: "%s" in term "%s"' % (filename, key, term)
                    )

                # check for key types
                for key in f_yaml[term]:
                    value = f_yaml[term][key]

                    self.assertTrue(isinstance(value, self.get_key_types(key)), 
                        msg='\nInvalid key type in "%s" in term "%s":\
                            \n"%s" must be of type %s' \
                            % (filename, term, key, ' or '.join(self.get_type_names_for_key(key)))
                    )

    def test_translation_files_validity(self):
        for filename in os.listdir(TRANSLATIONS_DIR):
            if filename == 'en.yaml':
                continue

            with open(os.path.join(TRANSLATIONS_DIR, filename)) as f:
                f_yaml = yaml.load(f)
                for term in f_yaml:
                    for key in f_yaml[term]:
                        if term == '_meta':
                            self.assertIn(key, self.valid_meta_keys, 
                                msg='\nInvalid meta key in %s: "%s"' % (filename, key)
                            )
                            continue

                        self.assertIn(key, self.valid_term_keys_rest,
                            msg='\nInvalid key in %s: "%s" in term "%s"' % (filename, key, term)
                        )

                     # check for key types
                    for key in f_yaml[term]:
                        value = f_yaml[term][key]

                        self.assertTrue(isinstance(value, self.get_key_types(key)), 
                            msg='\nInvalid key type in "%s" in term "%s":\
                                \n"%s" must be of type %s' \
                                % (filename, term, key, ' or '.join(self.get_type_names_for_key(key)))
                        )


if __name__ == '__main__':
    unittest.main()