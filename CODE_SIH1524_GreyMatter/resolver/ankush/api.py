from flask import Flask, request, jsonify
from resoution import resolve_a, resolve_ns, select_server
from logs import log_info, log_error
from cache import LRUCache
import sklearn
from sc import get_predictions

app = Flask(__name__)

cache = LRUCache(10000)
cache.load_from_file("cache.txt")
cache.print_cache()

server_list = [
    "198.41.0.4",
    "170.247.170.2",
    "192.33.4.12",
    "199.7.91.13",
    "192.203.230.10",
    "192.5.5.241",
    "192.112.36.4",
    "198.97.190.53",
    "192.36.148.17",
    "192.58.128.30",
    "192.0.14.129",
    "199.7.83.42",
    "202.12.27.33"
]

blacklist = set()

with open("blacklist.txt", "r") as f:
    blacklist.update(line.strip() for line in f)

@app.route('/dns-query', methods=['GET', 'POST'])
def handle_dns_over_http():
    try:
        print("Atleast got here")
        domain = request.args.get('name', '')
        qtype = request.args.get('type', 'A')

        if domain.endswith("."):
            domain = domain[:-1]
        if domain.startswith("www."):
            domain = domain[4:]

        if domain in blacklist or (domain + "www.") in blacklist:
            log_info(f"Malicious domain requested: {domain}")
            return jsonify({'status': 'error', 'message': 'Malicious domain'})

        if qtype.upper() == 'A':
            if domain in cache.cache:
                resolved_rr = cache.get(domain)
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in resolved_rr]})
            
            try:
                resolved_rr = resolve_a(domain, server=select_server(server_list), cache=cache)
            except Exception as e:
                log_error(f"Error resolving A record for {domain}: {str(e)}")
                return jsonify({'status': 'error', 'message': 'DNS resolution error'})

            if resolved_rr:
                log_info(f"Resolved A record for {domain}: {str(resolved_rr[0].rdata)}")
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in resolved_rr]})
            else:
                return jsonify({'status': 'error', 'message': 'NXDOMAIN'})

        elif qtype.upper() == 'NS':
            ns_records = resolve_ns(domain, server=select_server(server_list), cache=cache)
            if ns_records:
                log_info(f"Resolved NS records for {domain}")
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in ns_records]})
            else:
                return jsonify({'status': 'error', 'message': 'NXDOMAIN'})

        else:
            return jsonify({'status': 'error', 'message': 'Unsupported query type'})
    except Exception as e:
        log_error(f"Error handling DNS request over HTTP: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Internal server error'})

@app.route('/dns-quer', methods=['GET', 'POST'])
def handle_dns_over_htt():
    try:
        # print("Atleast got here")
        domain = request.args.get('name', '')
        qtype = request.args.get('type', 'A')

        if domain.endswith("."):
            domain = domain[:-1]
        if domain.startswith("www."):
            domain = domain[4:]

        if domain in blacklist or (domain + "www.") in blacklist:
            log_info(f"Malicious domain requested: {domain}")
            return jsonify({'status': 'error', 'message': 'Malicious domain'})

        if qtype.upper() == 'A':
            if domain in cache.cache:
                resolved_rr = cache.get(domain)
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in resolved_rr]})
            temp = [domain[:-1] if domain.endswith(".") else domain]
            if get_predictions(domain) == 1:
                log_info(f"DGA detected from {addr} for {question.questions[0].qname}")
                response = dnslib.DNSRecord()
                response.header = question.header
                response.header.qr = 1
                response.questions = question.questions
                response.header.rcode = getattr(dnslib.RCODE, "NXDOMAIN")
                return jsonify({'status': 'failed', 'data': "DGA detected"})

            try:
                resolved_rr = resolve_a(domain, server=select_server(server_list), cache=cache)
            except Exception as e:
                log_error(f"Error resolving A record for {domain}: {str(e)}")
                return jsonify({'status': 'error', 'message': 'DNS resolution error'})

            if resolved_rr:
                log_info(f"Resolved A record for {domain}: {str(resolved_rr[0].rdata)}")
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in resolved_rr]})
            else:
                return jsonify({'status': 'error', 'message': 'NXDOMAIN'})

        elif qtype.upper() == 'NS':
            ns_records = resolve_ns(domain, server=select_server(server_list), cache=cache)
            if ns_records:
                log_info(f"Resolved NS records for {domain}")
                return jsonify({'status': 'success', 'data': [str(rr.rdata) for rr in ns_records]})
            else:
                return jsonify({'status': 'error', 'message': 'NXDOMAIN'})

        else:
            return jsonify({'status': 'error', 'message': 'Unsupported query type'})
    except Exception as e:
        log_error(f"Error handling DNS request over HTTP: {str(e)}")
        return jsonify({'status': 'error', 'message': 'Internal server error'})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80, debug=True)