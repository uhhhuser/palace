from flask import Blueprint, render_template, request, redirect, url_for, flash, session

from dbstruct import db, user as User

auth = Blueprint('auth', __name__)

@auth.route('/login', methods=['GET', 'POST'])
def login():
    
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        logUser = User.query.filter_by(username=username).first()

        if logUser and logUser.password == password:
            session['username'] = logUser.username
            session['userID'] = logUser.id
            return redirect(url_for('home'))
        else:
            flash('invalid user and pass')
            
    return render_template('login.html')

@auth.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('home'))

@auth.route('/signup', methods=['GET', 'POST'])
def signup():
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        if len(password) < 6 or len(password) > 16:
            flash("pass has to be 6-16 characters")
            
        elif User.query.filter_by(username=username).first():
            flash("username exists")
            
        else:
            newUser = User(username=username, password=password)
            db.session.add(newUser)
            db.session.commit()
            flash("account made, login")
            return redirect(url_for('auth.login'))

    return render_template('signup.html')