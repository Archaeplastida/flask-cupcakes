"""Flask app for Cupcakes"""
from flask import Flask, request, render_template, redirect, flash, session, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from models import db, connect_db, Cupcake

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///cupcakes_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SQLALCHEMY_ECHO'] = True
app.config['SECRET_KEY'] = 'Thisisacoolproject1000!'
app.config['DEBUG_TB_INTERCEPT_REDIRECTS'] = False
debug = DebugToolbarExtension(app)

connect_db(app)

db.create_all()

@app.route('/api/cupcakes')
def all_cupcakes():
    all_cupcakes = [cupcake.serialize() for cupcake in Cupcake.query.all()]
    return jsonify({'cupcakes':all_cupcakes})

@app.route('/api/cupcakes/<int:id>')
def specific_cupcake(id):
    the_cupcake = Cupcake.query.get_or_404(id).serialize()
    return jsonify({'cupcake':the_cupcake})

@app.route('/api/cupcakes', methods=['POST'])
def add_cupcake():
    new_cupcake = Cupcake(flavor=request.json["flavor"],
                          size=request.json["size"],
                          rating=request.json["rating"],
                          image=request.json.get("image"))
    db.session.add(new_cupcake)
    db.session.commit()
    return ({'cupcake':new_cupcake.serialize()}, 201)

@app.route('/api/cupcakes/<int:id>', methods=['PATCH'])
def edit_cupcake(id):
    current_cupcake = Cupcake.query.get_or_404(id)
    for attr in ["flavor", "size", "rating", "image"]:exec(f"current_cupcake.{attr} = request.json.get('{attr}', current_cupcake.{attr})")
    db.session.commit()
    return jsonify({'cupcake':current_cupcake.serialize()})

@app.route('/api/cupcakes/<int:id>', methods=['DELETE'])
def delete_cupcake(id):
    selected_cupcake = Cupcake.query.get_or_404(id)
    db.session.delete(selected_cupcake)
    db.session.commit()
    return jsonify(message="deleted")

@app.route('/')
def home_page():
    return render_template('home.html')