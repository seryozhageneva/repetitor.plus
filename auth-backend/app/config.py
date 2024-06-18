import os

SECRET_KEY = os.environ.get('SECRET_KEY') or 'secret'
SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or 'postgresql://user:password@localhost:30432/db'
SQLALCHEMY_TRACK_MODIFICATIONS = False
MAIL_SERVER = os.environ.get('MAIL_SERVER') or 'localhost'
MAIL_PORT = os.environ.get('MAIL_PORT') or 1025
EXTERNAL_HOST = os.environ.get('EXTERNAL_HOST') or 'localhost'
