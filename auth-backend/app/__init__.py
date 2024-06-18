from flask import Flask
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config.from_object('app.config')

db = SQLAlchemy(app)
mail = Mail(app)
jwt = JWTManager(app)

from . import routes, models

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3080, debug=True)
