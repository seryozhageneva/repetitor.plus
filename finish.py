import time
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import threading
import logging
import sys

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://user:password@192.168.0.109:30432/db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

logging.basicConfig(level=logging.INFO)
app.logger.addHandler(logging.StreamHandler(sys.stdout))

# Models
class ExistingTable(db.Model):
    __tablename__ = 'user'
    email = db.Column(db.String, primary_key=True)

class NewEmailTable(db.Model):
    __tablename__ = 'users'
    email = db.Column(db.String, primary_key=True)
    json_data = db.Column(db.JSON)

class Task(db.Model):
    __tablename__ = 'tasks'
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, db.ForeignKey('users.email'))
    task_pdf = db.Column(db.String)

class CalendarEntry(db.Model):
    __tablename__ = 'calendar'
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String)
    email = db.Column(db.String)
    cost = db.Column(db.String)
    pay_completed = db.Column(db.Boolean)
    tasks_pdf = db.Column(db.LargeBinary)  # Изменено на LargeBinary

# Function to synchronize tables
def sync_tables():
    with app.app_context():
        db.create_all()
        while True:
            emails = ExistingTable.query.all()
            for email in emails:
                existing_record = NewEmailTable.query.filter_by(email=email.email).first()
                if existing_record is None:
                    default_json_data = {
                        "id": email.email,
                        "Stud": True,
                        "teacher": {
                            "profile": {
                                "name": None,
                                "surname": None,
                                "description": None,
                                "photo": "photoURL/idk"
                            },
                            "calendar": {
                                "dates": {
                                    "01/04/2024:20-22": {
                                        "email": "",
                                        "cost": "",
                                        "payCompleted": True,
                                        "tasksPDF": []
                                    }
                                }
                            },
                            "students": [
                                {
                                    "email": "",
                                    "tasks": []
                                }
                            ]
                        },
                        "student": {
                            "profile": {
                                "name": None,
                                "surname": None,
                                "description": None,
                                "photo": "photoURL/idk"
                            },
                            "teachers": [
                                {
                                    "email": ""
                                }
                            ],
                            "emailbox": [
                                {
                                    "email": ""
                                }
                            ]
                        }
                    }

                    new_email = NewEmailTable(
                        email=email.email,
                        json_data=default_json_data
                    )
                    db.session.add(new_email)
            db.session.commit()
            time.sleep(15)

def update_profile(data):
    email = data.get('email')
    user = NewEmailTable.query.get(email)
    if user:
        json_data = user.json_data
        json_data['teacher']['profile']['name'] = data.get('name', json_data['teacher']['profile']['name'])
        json_data['teacher']['profile']['surname'] = data.get('lastname', json_data['teacher']['profile']['surname'])
        json_data['teacher']['profile']['description'] = data.get('description', json_data['teacher']['profile']['description'])
        user.json_data = json_data
        db.session.commit()
        return {"message": "Profile updated successfully"}
    else:
        return {"message": "User not found"}

def add_task(data):
    email = data.get('email')
    task = data.get('task')
    if NewEmailTable.query.get(email):
        new_task = Task(email=email, task_pdf=task)
        db.session.add(new_task)
        db.session.commit()
        return {"message": "Task added successfully"}
    else:
        return {"message": "User not found"}

def add_calendar_entry(data):
    date = data.get('date')
    email = data.get('email')
    cost = data.get('cost')
    pay_completed = data.get('pay_completed')
    tasks_pdf_file = request.files['tasks_pdf']
    tasks_pdf_data = tasks_pdf_file.read() if tasks_pdf_file else None

    new_entry = CalendarEntry(
        date=date,
        email=email,
        cost=cost,
        pay_completed=pay_completed,
        tasks_pdf=tasks_pdf_data
    )
    db.session.add(new_entry)
    db.session.commit()
    return {"message": "Calendar entry added successfully"}

def get_combined_data(email):
    user = NewEmailTable.query.get(email)
    if not user:
        return {"message": "User not found"}

    tasks = Task.query.filter_by(email=email).all()
    calendar_entries = CalendarEntry.query.filter_by(email=email).all()

    profile_data = {
        "name": user.name,
        "surname": user.lastname,
        "description": user.description
    }

    calendar_data = {
        "dates": [
            {
                "date": entry.date,
                "email": entry.email,
                "cost": entry.cost,
                "payCompleted": entry.pay_completed,
                "tasksPDF": entry.tasks_pdf
            }
            for entry in calendar_entries
        ]
    }

    students_data = [
        {
            "email": student.email,
            "tasks": [task.task_pdf for task in Task.query.filter_by(email=student.email).all()]
        }
        for student in NewEmailTable.query.all()  # Example logic, adjust as needed
    ]

    teachers_data = [
        {"email": teacher.email}  # Example logic, adjust as needed
        for teacher in NewEmailTable.query.all()  # Example logic, adjust as needed
    ]

    emailbox_data = [
        {"email": email.email}  # Example logic, adjust as needed
        for email in ExistingTable.query.all()  # Example logic, adjust as needed
    ]

    result = {
        "id": email,
        "Stud": True,  # Example value, adjust as needed
        "teacher": {
            "profile": profile_data,
            "calendar": calendar_data,
            "students": students_data
        },
        "student": {
            "profile": profile_data,
            "teachers": teachers_data,
            "emailbox": emailbox_data
        }
    }

    return result

@app.route('/get_data', methods=['POST'])
def get_data():
    data = request.get_json()
    id = data.get('id')

    if id is None:
        return jsonify({"error": "ID не предоставлен"}), 400

    user = NewEmailTable.query.get(id)

    if not user:
        return jsonify({"error": "Пользователь не найден"}), 404

    return jsonify(user.json_data), 200

# Маршрут для обновления данных
@app.route('/receive_corrected_data', methods=['POST'])
def receive_corrected_data():
    try:
        data = request.json
        email = data.get('id')
        json_data = data.get('data')

        if email is None or json_data is None:
            return jsonify({"error": "Неправильный ввод"}), 400

        user = NewEmailTable.query.get(email)

        if user:
            user.json_data = json_data
        else:
            new_user = NewEmailTable(email=email, json_data=json_data)
            db.session.add(new_user)

        db.session.commit()

        return jsonify({"status": "success", "message": "Данные успешно обновлены"}), 200

    except Exception as e:
        app.logger.error(f"Ошибка при обработке запроса: {e}")
        return jsonify({"error": str(e)}), 500

# Запуск приложения Flask
if __name__ == '__main__':
    threading.Thread(target=sync_tables).start()

    # Example to get combined data for a specific email (to be adjusted as needed)
    example_email = 'example@email.com'
    with app.app_context():
        result = get_combined_data(example_email)
        print(result)

    app.run(host='0.0.0.0', port=5000)
