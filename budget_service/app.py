from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://budget_user:budget_password@budget-db:5432/budget_db'
app.config['JWT_SECRET_KEY'] = 'your_secret_key'
db = SQLAlchemy(app)
jwt = JWTManager(app)
CORS(app)

class Budget(db.Model):
    __tablename__ = 'budgets'
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, nullable=False)
    category = db.Column(db.String, nullable=False)
    limit_sum = db.Column(db.Float, nullable=False)
    alert_threshold = db.Column(db.Float, default=0.9)


@app.route('/budgets', methods=['POST'])
@jwt_required()
def add_budget_limit():
    user_id = get_jwt_identity()
    data = request.json

    category = data.get('category')
    limit_sum = data.get('limit_sum')
    alert_threshold = data.get('alert_threshold', 0.9)  # Default to 90%

    if not category or not limit_sum:
        return jsonify({'message': 'Category and limit are required'}), 400

    new_budget = Budget(user_id=user_id, category=category, limit_sum=limit_sum, alert_threshold=alert_threshold)
    db.session.add(new_budget)
    db.session.commit()

    return jsonify({
        'message': 'Budget added successfully',
        'budget': {
            'id': new_budget.id,
            'category': new_budget.category,
            'limit_sum': new_budget.limit_sum,
            'alert_threshold': new_budget.alert_threshold
        }
    }), 201

@app.route('/budgets', methods=['GET'])
@jwt_required()
def get_budget_limits():
    user_id = get_jwt_identity()

    budgets = Budget.query.filter_by(user_id=user_id).all()

    budget_list = [{
        'id': budget.id,
        'category': budget.category,
        'limit': budget.limit_sum,
        'alert_threshold': budget.alert_threshold
    } for budget in budgets]

    return jsonify({
        'message': 'Budgets retrieved successfully',
        'budgets': budget_list
    }), 200

@app.route('/getlimit', methods=['GET'])
@jwt_required()
def get_limit():
    data = request.json
    user_id = get_jwt_identity()
    #user_id = 1
    category = data.get('category')

    if not category:
        return jsonify({'error': 'Category is required'}), 400

    budget = Budget.query.filter_by(user_id=user_id, category=category).first()
    if not budget:
        return jsonify({'error': 'No budget found for this category'}), 404

    return jsonify({'alert_threshold': budget.alert_threshold, 'limit': budget.limit_sum}), 200

@app.route('/budgets/<int:budget_id>', methods=['GET'])
@jwt_required()
def get_budget_by_id(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404
    return jsonify({
        'id': budget.id,
        'category': budget.category,
        'limit': budget.limit_sum,
        'alert_threshold': budget.alert_threshold
    })

@app.route('/budgets/<int:budget_id>', methods=['PUT'])
@jwt_required()
def update_budget_by_id(budget_id):
    user_id = get_jwt_identity()
    data = request.json
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404

    budget.category = data.get('category', budget.category)
    budget.limit_sum = data.get('limit', budget.limit_sum)
    db.session.commit()

    return jsonify({'message': 'Budget updated successfully'})

@app.route('/budgets/<int:budget_id>', methods=['DELETE'])
@jwt_required()
def delete_budget_by_id(budget_id):
    user_id = get_jwt_identity()
    budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
    if not budget:
        return jsonify({'message': 'Budget not found'}), 404

    db.session.delete(budget)
    db.session.commit()

    return jsonify({'message': 'Budget deleted successfully'})

if __name__ == '__main__':
    app.run(port=5003, host="0.0.0.0")