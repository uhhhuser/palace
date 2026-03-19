from flask import Blueprint, render_template, request, redirect, url_for, flash, session
from dbstruct import db, movie

movies = Blueprint('movies', __name__)

@movies.route('/add_movie', methods=['POST'])
def addMovie():

    if 'userID' not in session:
        flash("must be logged in")
        return redirect(url_for('auth.login'))

    movieTitle = request.form.get('title')
    moviePoster = request.form.get('poster')
    movieTmdbId = request.form.get('tmdb_id')
    movieStatus = request.form.get('status')

    existing_movie = movie.query.filter_by(
        userID=session['userID'], 
        tmdbID=movieTmdbId
    ).first()

    if existing_movie:
        flash("This movie is already in your list.")
        return redirect(request.referrer or url_for('home'))

    new_movie = movie(
        title=movieTitle,
        posterURL=moviePoster,
        tmdbID=movieTmdbId,
        status=movieStatus,
        userID=session['userID']
    )

    db.session.add(new_movie)
    db.session.commit()

    flash(f"added {movieTitle} to your {movieStatus} list")
    return redirect(url_for('movies.my_lists'))

@movies.route('/remove_movie/<int:movieId>', methods=['POST'])
def removeMovie(movieId):
    if 'userID' not in session:
        return redirect(url_for('auth.login'))
    
    movieRemove = movie.query.filter_by(id=movieId, userID=session['userID']).first()
    if movieRemove:
        db.session.delete(movieRemove)
        db.session.commit()
        flash(f"removed {movieRemove.title}")
    else:
        flash("movie not found")
        
    return redirect(url_for('movies.my_lists'))

@movies.route('/my_lists')
def my_lists():

    if 'userID' not in session:
        return redirect(url_for('auth.login'))

    userId = session['userID']

    watchlist = movie.query.filter_by(userID=userId, status='watchlist').all()
    watching = movie.query.filter_by(userID=userId, status='watching').all()
    watched = movie.query.filter_by(userID=userId, status='watched').all()

    return render_template('watchlist.html', 
                           watchlist=watchlist, 
                           watching=watching, 
                           watched=watched)