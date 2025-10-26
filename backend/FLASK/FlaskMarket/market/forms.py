from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField
from wtforms.validators import Length, EqualTo, Email, DataRequired, ValidationError
from market.models import User

class RegisterForm(FlaskForm):
    def validate_username(self, username_to_check):
        if len(username_to_check.data) < 2 or len(username_to_check.data) > 30:
            raise ValidationError("Username must be between 2 and 30 characters")
        user=User.query.filter_by(username=username_to_check.data).first()
        if user:    
            raise ValidationError("Username already exists! Please try a different username")

    def validate_email_address(self, email_address_to_check):
        if "@" not in email_address_to_check.data or "." not in email_address_to_check.data:
            raise ValidationError("Invalid email address")
        
        email_address = User.query.filter_by(email_address=email_address_to_check.data).first()
        if email_address:    
            raise ValidationError("Email Address already exists! Please try a different email address")

    username = StringField(label='User Name:', validators=[DataRequired()])
    email_address = StringField(label='Email Address:', validators=[DataRequired(), Email()])
    password1 = PasswordField(label='Password:', validators=[DataRequired(), Length(min=6)])
    password2 = PasswordField(label='Confirm Password:', validators=[DataRequired(), EqualTo('password1')])
    submit = SubmitField(label='Create Account')
    
class LoginForm(FlaskForm):
    username = StringField(label='User Name:', validators=[DataRequired()])
    password = PasswordField(label='Password:', validators=[DataRequired()])
    submit = SubmitField(label='Sign in') 


class PurchaseItemForm(FlaskForm):
    submit=SubmitField(label='Purchase Item!')
    
class SellItemForm(FlaskForm):
    submit=SubmitField(label='Sell Item!')
    