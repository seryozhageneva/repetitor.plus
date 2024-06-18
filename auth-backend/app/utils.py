from flask_mail import Message
from . import mail

def send_email(to, subject, body):
    msg = Message(subject, recipients=[to], sender='authservice@localhost.com')
    msg.body = body
    mail.send(msg)