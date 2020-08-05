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
County = base.classes.map_the_meal_county 
                                            
State = base.classes.map_the_meal_state  
USDA = base.classes.usda
USDA_state = base.classes.usda_state
State_lat_lng = base.classes.states
County_lat_lng = base.classes.county


# set up home route
@app.route("/")
def index():
    return render_template("chartIndex.html")

@app.route("/county")
def county():
    return render_template("county.html")

@app.route("/state")
def state():
    return render_template("state.html")

@app.route("/statebubble")
def statebubble():
    return render_template("statebubble.html")

# pull in state info for map
@app.route("/api/states")
def get_data_by_state():

    state_results = db.session.query(State_lat_lng, State).filter(State_lat_lng.state == State.abbv).all()
    state_data = {}
    for sll, s in state_results:
        state_data[sll.name] = {
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
    return jsonify(state_data)

# pull in county info for map
@app.route("/api/counties")
def get_data_by_county():
    
    county_results = db.session.query(County_lat_lng, County).filter(County_lat_lng.name == County.county).all()
    county_data = {}
    for cll, c in county_results:
        county_data[cll.name] = {
            "lat": float(cll.intptlat),
            "lng": float(cll.intptlng),
            # "coordinates": [float(cll.intptlng), float(cll.intptlat)],
            "geoid": float(cll.geoid),
            "fips": float(c.fips),
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
    # print(county_data)
    return jsonify(county_data)

# USDA data
@app.route("/api/usda")
def get_usda_data():

    usda_results = db.session.query(USDA).all()
    usda_data = []
    for x in usda_results:
       usda_dict = {}
       usda_dict["id"] = x.id
       usda_dict["category"] = x.category
       usda_dict["year"] = float(x.year)
       usda_dict["total_hh"] = float(x.total_hh_1000)
       usda_dict["fi_count"] = float(x.fi_count_1000)
       usda_dict["fi_rate"] = float(x.fi_rate)
       usda_data.append(usda_dict)
       
    return jsonify(usda_data)

@app.route("/api/usdastate")
def get_usda_state_data():

    usda_state_results = db.session.query(USDA_state).all()
    usda_state_data = []
    for x in usda_state_results:
       usda_state_dict = {}
       usda_state_dict["state"] = x.state
       usda_state_dict["id"] = x.id
       usda_state_dict["year"] = (x.year)
       usda_state_dict["fi_rate"] = float(x.fi_rate)
       usda_state_data.append(usda_state_dict)
       
    return jsonify(usda_state_data)

if __name__== "__main__":
    app.run(debug=True)




