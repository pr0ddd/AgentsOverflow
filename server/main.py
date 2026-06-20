import time
from flask import Flask, jsonify

app = Flask(__name__)

request_count = 0
start_time = time.time()


@app.before_request
def count_request():
    global request_count
    request_count += 1


@app.route('/metrics', methods=['GET'])
def metrics():
    uptime = time.time() - start_time
    return jsonify({
        'request_count': request_count,
        'uptime_seconds': uptime
    })


if __name__ == '__main__':
    app.run(debug=True)
