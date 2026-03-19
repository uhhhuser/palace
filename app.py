from flask import Flask, render_template, request, session
from search import searchMovie
from dbstruct import db, user, movie
from auth import auth
from watchlist import movies

app = Flask(__name__)
app.config['SECRET_KEY'] = 'dev-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)

app.register_blueprint(auth)
app.register_blueprint(movies)

@app.route('/')
def home():
    return render_template('index.html', username=session.get('username'))

@app.route('/search')
def search():
    query = request.args.get('query', '')
    if query:
        results = searchMovie(query)
    else:
        results = []
    return render_template('search.html', query=query, results=results)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)