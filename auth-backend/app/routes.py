from flask import request, jsonify, url_for
from . import app, db, mail
from .config import EXTERNAL_HOST
from .models import User
from .utils import send_email
from itsdangerous import URLSafeTimedSerializer, SignatureExpired
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity, get_jwt

s = URLSafeTimedSerializer(app.config['SECRET_KEY'])


@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({'message': 'pong'}), 200

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'User already exists'}), 409

    new_user = User(email=email)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()

    token = s.dumps(email, salt='email-confirm')
    confirm_url = f'https://{EXTERNAL_HOST}/confirm_email/{token}'
    send_email(email, 'Confirm Your Email', f'Please click the link to confirm your email: {confirm_url}')

    return jsonify({'message': 'User registered, please confirm your email'}), 201


@app.route('/confirm/<token>', methods=['GET'])
def confirm_email(token):
    try:
        email = s.loads(token, salt='email-confirm', max_age=3600)
    except SignatureExpired:
        return jsonify({'message': 'The token is expired'}), 400
    except:
        return jsonify({'message': 'Invalid token'}), 400

    user = User.query.filter_by(email=email).first_or_404()
    if user.is_active:
        return jsonify({'message': 'Account already confirmed'}), 400

    user.is_active = True
    db.session.commit()
    return jsonify({'message': 'Account confirmed'}), 200


@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    email = data.get('email')
    password = data.get('password')
    if not email or not password:
        return jsonify({'message': 'Missing email or password'}), 400
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        if not user.is_active:
            return jsonify({'message': 'Please confirm your email first'}), 400

        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user = get_jwt_identity()
    access_token = create_access_token(identity=current_user)
    refresh_token = create_refresh_token(identity=current_user)
    return jsonify({'access_token': access_token, 'refresh_token': refresh_token}), 200

@app.route('/forgot_password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400

    email = data.get('email')
    if not email:
        return jsonify({'message': 'Missing email'}), 400
    user = User.query.filter_by(email=email).first()

    if user:
        token = s.dumps(email, salt='password-reset')
        reset_url = f'https://{EXTERNAL_HOST}/reset_password/{token}'
        send_email(email, 'Reset Your Password', f'Please click the link to reset your password: {reset_url}')

    return jsonify({'message': 'If this email exists, a password reset link has been sent'}), 200



@app.route('/reset_password/<token>', methods=['POST'])
def reset_password(token):
    try:
        email = s.loads(token, salt='password-reset', max_age=3600)
    except SignatureExpired:
        return jsonify({'message': 'The token is expired'}), 400
    except:
        return jsonify({'message': 'Invalid token'}), 400

    user = User.query.filter_by(email=email).first_or_404()
    data = request.get_json()
    if not data:
        return jsonify({'message': 'No input data provided'}), 400
    new_password = data.get('password')
    if not new_password:
        return jsonify({'message': 'Missing password'}), 400
    user.set_password(new_password)
    db.session.commit()

    return jsonify({'message': 'Password has been reset'}), 200

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected_route():
    current_user = get_jwt_identity()
    return jsonify({'message': 'You are authorized', 'user_id': current_user}), 200