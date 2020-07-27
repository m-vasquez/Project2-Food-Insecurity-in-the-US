import warnings
warnings.filterwarnings('ignore')

import numpy as np

import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func
from sqlalchemy import distinct, desc
import os
from postgres_pw import pw


from flask import Flask, jsonify, render_template, request

# Flask Setup

app = Flask(__name__)

# Database Setup

from flask_sqlalchemy import SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL', '') or f"postgresql://postgres:{pw}@localhost:5432/Project2_FI_levels_US"

# Remove tracking modifications
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# reflect db and save references to the table
base = automap_base()
base.prepare(db.engine, reflect=True)
print(base.classes)
for table in base.classes:
    print(table)

# map_the_meal_county
County = base.classes.map_the_meal_county ### (is a join needed and a view created which combines map_the_meal_county
                                            ### with the necessary lat/long i.e the map_the_meal_county table and county table????)
State = base.classes.map_the_meal_state  ### same as above w/state data
USDA = base.classes.usda
USDA_state = base.classes.usda_state
State_lat_lng = base.classes.states
County_lat_lng = base.classes.county


# set up home route
@app.route("/")
def index():
    return render_template("index.html")

# pull in state info for map
@app.route("/api/states")
def get_data_by_state():
    
    state_results = db.session.query(State_lat_lng, State).filter(State_lat_lng.state == State.abbv).all()
    state_geo = {}
    for sll, s in state_results:
        state_geo[sll.name] = {
            "lat": float(sll.latitude),
            "lng": float(sll.longitude),
            "state": s.state,
            "fi_rate": float(s.fi_rate),
            "fi_count": float(s.fi_count),
            "fi_rate_child": float(s.fi_rate_child),
            "fi_count_child": float(s.fi_count_child),
            "fi_rate_fpl": float(s.fi_rate_below_185_fpl_child),
            "meal_cost": float(s.cost_per_meal),
            "budget_shortfall": float(s.food_budget_shortfall)
        }  
    # print(state_geo)
    return jsonify(state_geo)

# state data
# @app.route("/api/states/<state>")
# def data_by_state(state):
#     data_results = db.session.query(state.state,state.fi_rate, state.fi_rate_child, state.fi_count_child, state.fi_rate_below_185_fpl, state.cost_per_meal, state.food_budget_shortfall)

#     # create an array to sort

# pull in county info for map
@app.route("/api/counties")
def get_data_by_county():
    
    county_results = db.session.query(County_lat_lng, County).filter(County_lat_lng.name == County.county).all()
    county_data = {}
    for cll, c in county_results:
        county_data[cll.name] = {
            "lat": float(cll.intptlat),
            "lng": float(cll.intptlng),
            "state": c.state, # name of the state county is in
            "county": c.county, # name of indv county
            "fi_rate": float(c.fi_rate),
            "fi_count": float(c.fi_count),
            "fi_rate_child": float(c.fi_rate_child),
            "fi_count_child": c.fi_count_child,
            "fi_rate_fpl": float(c.fi_rate_below_185_fpl_child),
            "meal_cost": float(c.cost_per_meal),
            "budget_shortfall": float(c.food_budget_shortfall)
        }  
    # print(state_geo)
    return jsonify(county_data)

if __name__== "__main__":
    app.run(debug=True)




