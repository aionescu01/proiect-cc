import requests
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:admin@localhost:5432/postgres'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
jwt = JWTManager(app)
BUDGET_SERVICE_URL = 'http://127.0.0.1:5003'

class Transaction(db.Model):
    __tablename__ = 'transactions'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    amount = db.Column(db.Float, nullable=False)
    type = db.Column(db.String(10), nullable=False)  # "income" or "expense"
    category = db.Column(db.String(50))
    date = db.Column(db.DateTime, nullable=False)
    description = db.Column(db.String(255))

@app.route('/transactions', methods=['POST'])
#@jwt_required()
def add_transaction():
    # user_id = get_jwt_identity()
    user_id = 1
    data = request.json

    transaction = Transaction(
        user_id=int(user_id),
        amount=data['amount'],
        type=data['type'],
        category=data['category'],
        date=data['date'],
        description=data.get('description', '')
    )

    response = requests.get(
        f'{BUDGET_SERVICE_URL}/getlimit',
        json={'category': data['category']},
        headers={'Authorization': f'Bearer {request.headers.get("Authorization").split(" ")[1]}'}
    )
    limit = response.json().get('limit')
    alert_threshold = response.json().get('alert_threshold')

    total_spent = db.session.query(
        db.func.sum(Transaction.amount)
    ).filter_by(user_id=user_id, category=data['category']).scalar() or 0

    new_total = total_spent + data['amount']
    category = data['category']

    if new_total >= limit:
        budget_check =  {'alert': 'exceeded', 'message': f'Exceeded budget limit for {category}. Spent {new_total}/{limit}.'}
    elif new_total >= limit * alert_threshold:
        budget_check = {'alert': 'proximity', 'message': f'Nearing budget limit for {category}. Spent {new_total}/{limit}.'}

    else:
        budget_check = {'message': 'Transaction is within budget.'}



    db.session.add(transaction)
    db.session.commit()
    return jsonify({
        'transaction': {
            'id': transaction.id,
            'category': transaction.category,
            'amount': transaction.amount
        },
        'budget_status': budget_check
    })

@app.route('/transactions', methods=['GET'])
#@jwt_required()
def get_transactions():
    #user_id = get_jwt_identity()
    user_id = 1
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': t.id, 'amount': t.amount, 'type': t.type,
        'category': t.category, 'date': t.date, 'description': t.description
    } for t in transactions])



if __name__ == '__main__':
    app.run(port=5001, host="0.0.0.0")
