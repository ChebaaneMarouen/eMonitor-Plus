from spellchecker import SpellChecker

spell = SpellChecker('fr')

# special tokens included in fastext
spell.word_frequency.load_words([" "," _url_","_number_","_symbol_"])

def correct_spelling(tokens):
    return [ spell.correction(word) for word in tokens]

