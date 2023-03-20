import re

f = open ('./stopwords-fr.txt')
stop_words = f.readlines()
f.close()

urlReg = r"(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9]\.[^\s]{2,})"

def replaceSpecialTokens(msg) :

    # replace urls
    msg = re.sub(urlReg," a_url_a ",msg)

    # replace numbers with _number_
    msg = re.sub(r"\b\d+\b"," a_number_a ",msg)

    # replace special symbols with _symbol_
    msg = re.sub(r"\b[^\s\w\?\!\._]+\b"," a_symbol_a ",msg)

    return msg

def convertToTokenSymbolsAsUsedInEmbed(token):
    return re.sub(r"a(_\w+_)a",r"\1",token)

def cleanSpaces(text):
    # remove trainling spaces
    text = text.strip()
    # remove double space
    text = re.subn(r"\s\s+"," ",text)[0]

    return text

def remove_stop_words(tokens):
    return list(filter(lambda x: x not in stop_words, tokens))

