import os

import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity


app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://transaction_user:transaction_password@transaction-db:5432/transaction_db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
BUDGET_SERVICE_URL = os.getenv('BUDGET_SERVICE_URL', 'http://budget_service:5003')

db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

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
@jwt_required()
def add_transaction():
    user_id = get_jwt_identity()
    #user_id = 1
    data = request.json

    transaction = Transaction(
        user_id=int(user_id),
        amount=data['amount'],
        type=data['type'],
        category=data['category'],
        date=data['date'],
        description=data.get('description', '')
    )
    amount = float(data['amount'])

    if transaction.type == 'expense':
        response = requests.get(
            f'{BUDGET_SERVICE_URL}/getlimit',
            json={'category': data['category']},
            headers={'Authorization': f'Bearer {request.headers.get("Authorization").split(" ")[1]}'}
        )
        if response.status_code != 404:
            limit = response.json().get('limit')
            alert_threshold = response.json().get('alert_threshold')

            total_spent = db.session.query(
                db.func.sum(Transaction.amount)
            ).filter_by(user_id=user_id, category=data['category']).scalar() or 0

            new_total = total_spent + transaction.amount

            if new_total >= limit:
                budget_check = {'alert': 'exceeded',
                                'message': f'Exceeded budget limit for {transaction.category}. Spent {new_total}/{limit}.'}
            elif new_total >= limit * alert_threshold:
                budget_check = {'alert': 'proximity',
                                'message': f'Nearing budget limit for {transaction.category}. Spent {new_total}/{limit}.'}

            else:
                budget_check = {'message': 'Transaction is within budget.'}
        else:
            budget_check = {'message': ''}  # No budget set for this category
    else:
        budget_check = {'message': ''}  # No budget set for this category


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
@jwt_required()
def get_transactions():
    user_id = get_jwt_identity()
    #user_id = 1
    transactions = Transaction.query.filter_by(user_id=user_id).all()
    return jsonify([{
        'id': t.id, 'amount': t.amount, 'type': t.type,
        'category': t.category, 'date': t.date, 'description': t.description
    } for t in transactions])

@app.route('/transactions/<int:transaction_id>', methods=['GET'])
@jwt_required()
def get_transaction_by_id(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404
    return jsonify({
        'id': transaction.id,
        'date': transaction.date,
        'description': transaction.description,
        'amount': transaction.amount,
        'category': transaction.category,
        'type': transaction.type
    })

@app.route('/transactions/<int:transaction_id>', methods=['DELETE'])
@jwt_required()
def delete_transaction_by_id(transaction_id):
    user_id = get_jwt_identity()
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    db.session.delete(transaction)
    db.session.commit()

    return jsonify({'message': 'Transaction deleted successfully'})

@app.route('/transactions/<int:transaction_id>', methods=['PUT'])
@jwt_required()
def update_transaction_by_id(transaction_id):
    user_id = get_jwt_identity()
    data = request.json
    transaction = Transaction.query.filter_by(id=transaction_id, user_id=user_id).first()
    if not transaction:
        return jsonify({'message': 'Transaction not found'}), 404

    if transaction.type == 'expense':
        response = requests.get(
            f'{BUDGET_SERVICE_URL}/getlimit',
            json={'category': data['category']},
            headers={'Authorization': f'Bearer {request.headers.get("Authorization").split(" ")[1]}'}
        )
        if response.status_code != 404:
            limit = response.json().get('limit')
            alert_threshold = response.json().get('alert_threshold')

            total_spent = db.session.query(
                db.func.sum(Transaction.amount)
            ).filter_by(user_id=user_id, category=data['category']).scalar() or 0

            new_total = total_spent - float(transaction.amount) + float(data['amount'])

            if new_total >= limit:
                budget_check = {'alert': 'exceeded',
                                'message': f'Exceeded budget limit for {transaction.category}. Spent {new_total}/{limit}.'}
            elif new_total >= limit * alert_threshold:
                budget_check = {'alert': 'proximity',
                                'message': f'Nearing budget limit for {transaction.category}. Spent {new_total}/{limit}.'}

            else:
                budget_check = {'message': 'Transaction is within budget.'}
        else:
            budget_check = {'message': ''} # No budget set for this category
    else:
        budget_check = {'message': ''}  # No budget set for this category

    transaction.date = data.get('date', transaction.date)
    transaction.description = data.get('description', transaction.description)
    transaction.amount = data.get('amount', transaction.amount)
    transaction.category = data.get('category', transaction.category)
    transaction.type = data.get('type', transaction.type)
    db.session.commit()

    return jsonify({'message': 'Transaction updated successfully', 'budget_check': budget_check})


@app.route('/transactions/type/<string:transaction_type>', methods=['GET'])
@jwt_required()
def get_transactions_by_type(transaction_type):
    user_id = get_jwt_identity()
    if transaction_type not in ['income', 'expense']:
        return jsonify({'message': 'Invalid transaction type'}), 400

    transactions = Transaction.query.filter_by(type=transaction_type, user_id=user_id).all()
    return jsonify([{
        'id': transaction.id,
        'date': transaction.date,
        'description': transaction.description,
        'amount': transaction.amount,
        'category': transaction.category
    } for transaction in transactions])


if __name__ == '__main__':
    app.run(port=5001, host="0.0.0.0")
