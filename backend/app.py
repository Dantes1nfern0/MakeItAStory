from flask import Flask
from flask_cors import CORS
from routes.upload import upload_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.register_blueprint(upload_bp)

if __name__ == "__main__":
    app.run(debug=True, port=5001)
