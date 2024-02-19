from flask import Flask, jsonify, request  # Import 'request' module
from taxii2client import Collection
from stix2 import TAXIICollectionSource, Filter
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
 # collection = Collection("https://osint.digitalside.it/taxii2reports/collections/e98d6c94-fbce-11ed-b5dd-3bad2ffe9ebf/", user="guest", password="guest")

@app.route('/query', methods=['POST'])  # Change method to POST
def query_taxii():
    try:
        # Extract input values from the JSON request
        data = request.json
        print(data)
        collection_url = data.get('link')  # Update 'input1' to the actual field name
        user = data.get('userid')  # Update 'input2' to the actual field name
        password = data.get('password')  # Update 'input3' to the actual field name
        # collection = Collection("https://osint.digitalside.it/taxii2reports/collections/e98d6c94-fbce-11ed-b5dd-3bad2ffe9ebf/", user="guest", password="guest")
        collection = Collection(collection_url, user=user, password=password)
        tc_source = TAXIICollectionSource(collection)

        f1 = Filter("type", "=", "malware")
        malwares = tc_source.query([f1])

        results = []
        for malware in malwares:
            serialized_malware = json.loads(malware.serialize())
            results.append(serialized_malware)

        response_data = {
            "results": results,
            "total_malwares": len(results)
        }

        return jsonify(response_data)

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
