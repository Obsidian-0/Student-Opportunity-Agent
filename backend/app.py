# app.py
from flask import Flask
from flask_cors import CORS
from models.db import init_db
from routes.auth import auth
from routes.skills import skills_bp
from routes.jobs import jobs_bp
from routes.intershala_routes import internshala_bp
app = Flask(__name__)
CORS(app)
# Blueprints register karo
app.register_blueprint(internshala_bp)
app.register_blueprint(auth)
app.register_blueprint(skills_bp)
app.register_blueprint(jobs_bp)

# DB initialize karo
with app.app_context():
    init_db()

if __name__ == "__main__":
    app.run(debug=True,threaded=True, port=5000)