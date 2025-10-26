import os
from flask import Flask
from flask import render_template
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_login import LoginManager
from flask_cors import CORS


# If a built frontend exists (project/dist), serve it as the static folder.
base_dir = os.path.abspath(os.path.dirname(__file__))
frontend_build_dir = os.path.normpath(os.path.join(base_dir, '..', '..', 'project', 'dist'))

if os.path.exists(frontend_build_dir):
	# Serve built React app in production mode
	app = Flask(__name__, static_folder=frontend_build_dir, template_folder=frontend_build_dir)
else:
	# Default Flask app (development) - React dev server will handle the frontend
	app = Flask(__name__)

CORS(app)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///market.db'
app.config['SECRET_KEY'] = 'ebbda6446482d79085077ee2'
db = SQLAlchemy(app)
bcrypt = Bcrypt(app)
login_manager=LoginManager(app)
login_manager.login_view = 'login_page'  # type: ignore
login_manager.login_message_category = 'info'  # type: ignore

from market import routes