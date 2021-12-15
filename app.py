from flask import Flask, request
import json
from utils import run_docker
from flask_cors import CORS
from flask_mysqldb import MySQL
from decouple import config


app = Flask(__name__, static_folder="build", static_url_path="/")
CORS(app)

app.config["MYSQL_HOST"] = config("host")
app.config["MYSQL_USER"] = config("user")
app.config["MYSQL_PASSWORD"] = config("password")
app.config["MYSQL_DB"] = config("db")

mysql = MySQL(app)


@app.route("/")
@app.route("/index")
def index():
    return app.send_static_file("index.html")


@app.route("/code", methods=["GET"])
def code():
    return app.send_static_file("index.html")


@app.route("/problems", methods=["GET"])
def problems():
    cursor = mysql.connection.cursor()
    cursor.execute("SELECT * FROM problems")
    columns = cursor.description
    result = [{columns[index][0]: column for index, column in enumerate(value)} for value in cursor.fetchall()]
    return json.dumps(result)


@app.route("/code", methods=["POST"])
def test_code():
    content = request.get_json()
    code = content["code"]
    test = content["test"]
    language = content["language"]
    func = content["function"]
    parameters = content["parameters"]
    try:
        stdout, stderr, error = run_docker(language, code, test, func, parameters)
        return {"error": error, "stdout": stdout, "stderr": stderr}
    except Exception as e:
        print("error:", e)
        return {"error": True, "message": str(e)}


if __name__ == "__main__":
    app.run()
