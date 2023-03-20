from cleaner import replaceSpecialTokens,cleanSpaces,remove_stop_words, convertToTokenSymbolsAsUsedInEmbed
import cleaner
import spelling
class Tokenizer():
    """docstring for posTagger
    Dummy class that generates part of speech using spacy.
    TODO: implement language detection maybe?
    """
    def __init__(self, lang = "fr"):
        self.lang = lang
        #self.nlp = spacy.load(lang)

    def generateTokens(self, text):

        cleanText = replaceSpecialTokens(text)
        cleanText = cleanSpaces(cleanText)


        tokens = cleanText.rstrip().lstrip().strip().split(' ')

        tokens = [token.lower() for token in tokens]
        tokens = [ convertToTokenSymbolsAsUsedInEmbed(token) for token in tokens ]
        tokens = remove_stop_words(tokens)
        # TODO: performance
        #tokens = spelling.correct_spelling(tokens)

        return tokens
