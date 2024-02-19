import tldextract
import hashlib
import pickle
import sklearn

with open("dga_dtc.pkl", "rb") as f:
    model = pickle.load(f)

def extract_features(domain):
    features = {}

    # Extract domain components using tldextract
    ext = tldextract.extract(domain)
    sld = ext.domain
    tld = ext.suffix
    features['SLD_Length'] = len(sld)
    features['TLD_Length'] = len(tld)
    features['Symbol_Ratio'] = sum(1 for char in domain if not char.isalnum()) / len(domain)
    features['TLD_Hash'] = int(hashlib.md5(tld.encode()).hexdigest(), 16)
    features['TLD_Unique_Chars_Length'] = len(set(tld))
    features['Num_Digits_SLD'] = sum(char.isdigit() for char in sld)
    vowels = set('aeiouAEIOU')
    cons_consecutive = sum(1 for i in range(len(domain)-1) if domain[i].isalpha() and domain[i+1].isalpha() and domain[i] not in vowels and domain[i+1] not in vowels)
    features['Consecutive_Cons_Ratio'] = cons_consecutive / (len(domain) - sld.count('.') - 1)
    hex_chars = set('abcdefABCDEF0123456789')
    features['Hex_Ratio'] = sum(1 for char in domain if char in hex_chars) / len(domain)
    
    return features

def get_predictions(domain):
    prediction = model.predict([list(extract_features(domain).values())])
    return prediction[0]

