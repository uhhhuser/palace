from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager

from backend.search import searchMovie
from backend.dbstruct import db, user, movie, movielist
from backend.auth import auth
from backend.watchlist import movies
from backend.lists import lists
from backend.clubs import clubs

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'dev-secret-key-change-in-production'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///users.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# initialize extensions here
db.init_app(app)
jwt = JWTManager(app)
CORS(app)

# register blueprints here
app.register_blueprint(auth, url_prefix='/api/auth')
app.register_blueprint(movies, url_prefix='/api/movies')
app.register_blueprint(lists, url_prefix='/api/lists')
app.register_blueprint(clubs, url_prefix='/api/clubs')

# route here
@app.route('/api/')
def home():
    return jsonify({
        'message': 'Movie Track API',
        'version': '1.0'
    })


@app.route('/api/search')
def search():
    query = request.args.get('query', '')
    
    results = searchMovie(query) if query else []
    
    return jsonify({
        'query': query,
        'results': results
    })


if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
    app.run(debug=True)
