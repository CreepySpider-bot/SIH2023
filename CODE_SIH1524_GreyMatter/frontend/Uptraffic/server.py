from flask import Flask, request, jsonify
from scapy.all import *
import pickle
import pandas as pd
from werkzeug.utils import secure_filename
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

with open("miracle.pkl", "rb") as model_file:
    model = pickle.load(model_file)

with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)

def dns_tunnel_detection(packet):
    if DNSQR in packet and DNSRR not in packet:
        query = packet[DNSQR].qname.decode('utf-8')

        test_data = pd.DataFrame({'Query': [query]})
        test_data['Concatenated'] = test_data['Query'].astype(str)
        test_data_vec = vectorizer.transform(test_data['Concatenated'])
        predicted_label = int(model.predict(test_data_vec)[0])  # Convert to regular Python integer

        return {"Query": query, "Prediction": predicted_label}

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file:
        pcap_file = f"uploads/{secure_filename(file.filename)}"
        file.save(pcap_file)

        packets = rdpcap(pcap_file)
        results = []

        for packet in packets:
            result = dns_tunnel_detection(packet)
            if result:
                results.append(result)
 
        return jsonify(results)

if __name__ == '__main__':
    app.run(debug=True,port=3003)
