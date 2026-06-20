from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/version", methods=["GET"])
def get_version():
    return jsonify({"version": "1.0"})


@app.route("/ping", methods=["GET"])
def ping():
    return jsonify({"pong": True})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000)
