# Install required packages: pip install flask flask-socketio scapy
from flask import Flask, render_template, request
from flask_socketio import SocketIO
from scapy.all import sniff, IP
from scapy.all import *
import pickle
from sklearn.feature_extraction.text import CountVectorizer
import pandas as pd

app = Flask(__name__)

socketio = SocketIO(app, cors_allowed_origins="*")

#################################################PREDICT-DNS-TUNNELING###############################################################
with open("miracle.pkl", "rb") as model_file:
    model = pickle.load(model_file)
    
with open("vectorizer.pkl", "rb") as vectorizer_file:
    vectorizer = pickle.load(vectorizer_file)
    

def predict_dns_tunneling(query):


    test_data = pd.DataFrame({'Query': [query]})

    test_data['Concatenated'] = test_data['Query'] 

    test_data_concatenated = test_data['Concatenated'].astype(str)

    test_data_vec = vectorizer.transform(test_data_concatenated)

    predicted_label = model.predict(test_data_vec)[0]
    print(f"Prediction: {predicted_label}")
    return predicted_label

    # print("Potential DNS tunneling detected:")
    # print(f"Query: {query}")
    # print(f"Prediction: {predicted_label}")
    # print("----------------------------", count, "----------------------------")
    

#################################################PREDICT-DNS-TUNNELING###############################################################

@app.route('/')
def index():
    return render_template('index.html')

@socketio.on('connect')
def handle_connect():
    pass

@socketio.on('disconnect')
def handle_disconnect():
    pass

def packet_callback(packet):
    if IP in packet and DNSQR in packet and DNSRR not in packet:
        data = {
            'src_ip': packet[IP].src,
            'dst_ip': packet[IP].dst,
            'query':  packet[DNSQR].qname.decode('utf-8')
        }
        color = 'red' if predict_dns_tunneling(data['query']) == 1 else 'green'
        data['color'] = color
        socketio.emit('update_traffic', data)

@app.route('/filter_traffic', methods=['POST'])
def filter_traffic():
    ip_to_filter = request.form.get('ip')
    sniff(prn=packet_callback, store=0, iface='Wi-Fi', filter="udp port 53")
    return 'Filtering started'

if __name__ == '__main__':
    socketio.run(app, debug=True)
