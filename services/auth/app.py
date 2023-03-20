from flask import Flask, jsonify, request, abort
import json
from bson.json_util import dumps
from timeit import default_timer as timer
from dbService import DBService


dbService = DBService()
# init app
app = Flask(__name__)


@app.route('/', methods=['POST'])
def authenticate():
    '''dummy service for authenticating'''

    if not request.json:
        abort(400)
    else:
        # check for valid parameters

        for parameter in ['provider', 'user', 'app']:
            if (parameter not in request.json):
                abort(400)

                return

        start = timer()
        app_id = request.json["app"]["id"]
        chatbot = dbService.getApp(app_id)

        if(not chatbot):
            abort(403)

            return
        # TODO: keep in mind this is just a dev solution

        if(request.json["provider"]["name"] == "cirtana"):
            return jsonify({
                "success": True,
                "time": timer() - start,
                "models": dbService.getAppModels(chatbot),
                "handout": {} if(not "handout" in chatbot) else chatbot['handout'],
                "lang": chatbot["lang"],
                "secondaryLangs": chatbot["secondaryLangs"]
            })

        result = dbService.getAppTokens(
            request.json["provider"]['id'], chatbot)

        authorized = True if (result) else False
        response = {"success": authorized}

        if(authorized):
            response['middleware'] = result["settings"]
            response['middleware']['_id'] = str(result["_id"])
            response['callback_url'] = result['url']
            response['endpoint'] = result.get('endpoint')
            response['models'] = dbService.getAppModels(chatbot)
            response["lang"] = chatbot['lang']
            response['secondaryLangs'] = chatbot['secondaryLangs']

            if('handout' in chatbot):
                response['handout'] = chatbot['handout']
            else:
                response['handout'] = {}

        response['time'] = timer() - start
        statusCode = 200

        return jsonify(json.loads(dumps(response))), statusCode


# returning a heart
@app.route("/heartbeat", methods=["GET"])
def heartBeating():
    return "I'm alive"


if __name__ == '__main__':
    app.run(debug=True, port=80, host='0.0.0.0')
