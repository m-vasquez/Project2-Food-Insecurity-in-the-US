-- create table for mmg (FA) county data
Create Table map_the_meal_county (
	id Serial Primary Key,
	FIPS INT,  -- GEOID
	state VARCHAR(30),
	abbv VARCHAR(30),
	county VARCHAR(40),
	fi_rate INT,
	fi_count INT,
	fi_rate_child INT,
	fi_count_child INT,
	fi_rate_below_185_fpl_child INT,
	cost_per_meal NUMERIC,
	food_budget_shortfall NUMERIC
);

-- create table for mmg (FA) state data

Create Table map_the_meal_state (
	id Serial Primary Key,
	FIPS INT,
	state VARCHAR(30),
	abbv VARCHAR(30),
	fi_rate INT,
	fi_count INT,
	fi_rate_child INT,
	fi_count_child INT,
	fi_rate_below_185_fpl_child INT,
	cost_per_meal NUMERIC,
	food_budget_shortfall NUMERIC
);

-- create table for USDA general US data 

Create Table usda(
	id Serial Primary Key,
	year INT,			-- year for chosen data
	category VARCHAR(40),
	total_hh_1000 INT, 
	fi_count_1000 INT,
	fi_rate DEC
);

-- create table for USDA state data
Create Table usda_state (
	id Serial Primary Key,
	state VARCHAR(10), -- state name
	year VARCHAR(15), -- year block of data
	num_households INT,
	num_intv INT,
	fi_rate DEC,
	moe INT
);

-- load in data to tables from jupyter

-- check data loaded in properly

select * from map_the_meal_county;
select * from map_the_meal_state;
select * from usda;
select * from usda_state;


-- creating tables for lat/long county and state data

Create Table county (
	USPS Varchar(10) not null, -- abbv of state county is in
	GEOID INT,       -- FIPS #
	ANSICODE INT,
	NAME Varchar(50) not null,	-- name of county
	ALAND DEC,	
	AWATER DEC,
	ALAND_SQMI DEC,	
	AWATER_SQMI DEC,
	INTPTLAT DEC not null,
	INTPTLNG DEC not null
);

Create Table states (
	state Varchar(35) not null, -- abbv of state
	latitude DEC not null,
	longitude DEC not null,
	name Varchar(30) not null -- name of state
);

-- load csv data
-- check csv data loaded properly
select * from county;
select * from states;

-- alter table and add PK's to county and state tables
alter table states
add id serial primary key

alter table county
add id serial primary key

-- check tables for pk's
select * from county;
select * from states;