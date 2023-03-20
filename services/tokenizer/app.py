from flask import Flask, jsonify, request, abort
from tokenizer import Tokenizer
from timeit import default_timer as timer
import spelling

from cleaner import replaceSpecialTokens,cleanSpaces,remove_stop_words, convertToTokenSymbolsAsUsedInEmbed

# init app
app = Flask(__name__)

# init PosTagger

supported_lang = ['fr']
tokenizers = {}
for lang in supported_lang :
    tokenizers[lang] = Tokenizer(lang)

@app.route('/', methods=['POST'])
def processUserText():

    if not request.json or not "text" in request.json :
        abort(400)
    elif 'language' in request.json and request.json['language'] not in supported_lang :
        abort(400)
    else:
        start = timer()
        text =  request.json['text']
        if('language' in request.json) :
            lang =  request.json['language']
        else :
            lang = 'fr'
        response = {}


        tokens = tokenizers[lang].generateTokens(text)

        response['tokens'] = tokens
        response['time'] = timer() - start

        return jsonify(response) , 200

@app.route('/bulk',methods=['POST'])
def bulkProcess():
    if('language' in request.json) :
        lang =  request.json['language']
    else :
        lang = 'fr'

    texts = request.json['texts']
    tokens = [tokenizers[lang].generateTokens(text) for  text in texts ]
    response = {
            "tokens" : tokens
            }

    return jsonify(response) , 200

#returning a heart
@app.route("/heartbeat", methods=["GET"])
def heartBeating():
    return "I'm alive"

if __name__ == '__main__':
    app.run(debug=True, port=80, host='0.0.0.0')

