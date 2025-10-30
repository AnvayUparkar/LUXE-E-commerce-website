from market import app
import os
from dotenv import load_dotenv
from urllib.parse import urljoin
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
FRONTEND_BASE_URL = os.environ.get('FRONTEND_BASE_URL', 'http://localhost:5173')
import os
from flask import render_template, redirect, url_for, flash, get_flashed_messages, request, jsonify, send_from_directory
from market.models import Item, User
from market.forms import RegisterForm, LoginForm, PurchaseItemForm, SellItemForm
from market import db, login_manager
from flask_login import login_user, logout_user, login_required, current_user

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

@app.route('/')
@app.route('/home')
def home_page():
    # If a built frontend exists, serve the index.html from the build.
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    # In development, redirect to the React dev server (Vite) or env base
    return redirect(urljoin(FRONTEND_BASE_URL, '/'))

# @app.route ('/about/<username>')
# def about_page(username):    
#     return f'<h1>This is the about page of {username}</h1>' 

@app.route('/market',methods=['GET', 'POST'])
@login_required
def market_page():
    items=Item.query.all()
    purchase_form=PurchaseItemForm()
    sell_form=SellItemForm()
    if request.method=='POST':
        #Purchase Item Logic
        purchased_item=request.form.get('purchased_item')
        p_item_object=Item.query.filter_by(name=purchased_item).first()
        if p_item_object:
            if current_user.can_purchase(p_item_object):
                p_item_object.buy(current_user)
                flash(f'Congratulations! You purchased {p_item_object.name} for {p_item_object.price}$',category='success')
            else:
                flash(f'Unfortunately, you do not have enough money to purchase {p_item_object.name}!',category='danger')
        #Sell Item Logic
        sold_item=request.form.get('sold_item')
        s_item_object=Item.query.filter_by(name=sold_item).first()
        if s_item_object:
            if current_user.can_sell(s_item_object):
                s_item_object.sell(current_user)
                flash(f'Congratulations! You sold {s_item_object.name} back to market!',category='success')
            else:
                flash(f'Something went wrong with selling {s_item_object.name}',category='danger')
                
        return redirect(url_for('market_page'))
        
    items=Item.query.filter_by(owner=None)
    owned_items=Item.query.filter_by(owner=current_user.id)
    # For development, let the React frontend handle the UI. Redirect there.
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return redirect(urljoin(FRONTEND_BASE_URL, '/market'))

@app.route('/register', methods=['GET', 'POST'])
def register_page():
    form = RegisterForm()
    if form.validate_on_submit():
        from typing import cast
        user_to_create = User(
            username=cast(str, form.username.data),
            email_address=cast(str, form.email_address.data),
            password=cast(str, form.password1.data)
        )
        db.session.add(user_to_create)
        db.session.commit()
        login_user(user_to_create)
        flash(f'Account created sucessfully!! You are logged in as: {user_to_create.username}',category='success')
        
        return redirect(url_for('market_page'))  # Redirect after success
    if form.errors!={}: #if there are not errors from the validations
        for err_msg in form.errors.values():
            flash(f'There was an error with creating a user: {err_msg}',category='danger')
    # Redirect to the React frontend for registration UI
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return redirect(urljoin(FRONTEND_BASE_URL, '/register'))

@app.route('/login',methods=['GET', 'POST'])
def login_page():
    form=LoginForm()
    if form.validate_on_submit():   
        attempted_user=User.query.filter_by(username=form.username.data).first()
        if attempted_user and attempted_user.check_password_correction(
            attempted_password=form.password.data   
        ):           
            login_user(attempted_user)
            flash(f'Success! You are logged in as: {attempted_user.username}',category='success')
            return redirect(url_for('market_page'))
        else:
            flash('Username and password are not match! Please try again',category='danger')
    # Redirect to the React frontend for login UI
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return redirect(urljoin(FRONTEND_BASE_URL, '/login'))

@app.route('/logout')
def logout_page():
    logout_user()
    flash("You have been logged out!",category='info')
    # Redirect back to frontend home
    if app.static_folder and os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return redirect(urljoin(FRONTEND_BASE_URL, '/'))


# -----------------------
# JSON API endpoints for React frontend
# -----------------------


@app.route('/api/register', methods=['POST'])
def api_register():
    # Debug: log incoming payload and headers to help diagnose 400 responses
    try:
        data = request.get_json()
    except Exception:
        data = None
    print('--- /api/register called ---')
    print('Headers:', dict(request.headers))
    print('Raw data:', request.get_data(as_text=True))
    print('Parsed JSON:', data)

    if not data:
        return jsonify({'error': 'No JSON provided or invalid JSON'}), 400

    username = data.get('username')
    email = data.get('email')
    password = data.get('password')

    if not username or not email or not password:
        return jsonify({'error': 'username, email and password are required'}), 400

    # Check uniqueness
    if User.query.filter_by(username=username).first():
        print('Register failed: username exists ->', username)
        return jsonify({'error': 'Username already exists'}), 400
    if User.query.filter_by(email_address=email).first():
        print('Register failed: email exists ->', email)
        return jsonify({'error': 'Email already registered'}), 400

    try:
        user = User(username=username, email_address=email, password=password)
        db.session.add(user)
        db.session.commit()
        return jsonify({'message': 'User created', 'user': {'id': user.id, 'username': user.username, 'email': user.email_address}}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def api_login():
    try:
        data = request.get_json()
    except Exception:
        data = None
    print('--- /api/login called ---')
    print('Headers:', dict(request.headers))
    print('Raw data:', request.get_data(as_text=True))
    print('Parsed JSON:', data)

    if not data:
        return jsonify({'error': 'No JSON provided or invalid JSON'}), 400

    identifier = data.get('username') or data.get('email')
    password = data.get('password')

    if not identifier or not password:
        return jsonify({'error': 'username/email and password required'}), 400

    # Try to find user by username or email
    user = User.query.filter((User.username == identifier) | (User.email_address == identifier)).first()
    if not user or not user.check_password_correction(password):
        return jsonify({'error': 'Invalid username/email or password'}), 401

    return jsonify({'message': 'Login successful', 'user': {'id': user.id, 'username': user.username, 'email': user.email_address, 'budget': user.budget}})


@app.route('/api/market', methods=['GET'])
def api_market():
    items = Item.query.filter_by(owner=None).all()
    result = []
    for item in items:
        result.append({'id': item.id, 'name': item.name, 'price': item.price, 'barcode': item.barcode, 'description': item.description})
    return jsonify(result)



@app.route('/api/_debug/users', methods=['GET'])
def api_debug_users():
    """Temporary debug endpoint: list all users (id, username, email). Remove in production."""
    users = User.query.all()
    out = [{'id': u.id, 'username': u.username, 'email': u.email_address} for u in users]
    print('Debug users requested, count=', len(out))
    return jsonify(out)