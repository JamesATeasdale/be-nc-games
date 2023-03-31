# Northcoders House of Games API

## Game review database

This is an api server for managing reviews of certain games and their respective comments.

A live version of this database can be found here: https://nc-games-id50.onrender.com/api/categories

All items in every section are automatically assigned an ID.

There are four different sections of data that are used in the database:

# Categories

This section consists of an array of objects that contain two key/value pairs. One is the title named 'slug', the other is a brief description of this category called "description".

# Reviews

Reviews are feedback of a game and include the following keys:

title <STRING>
designer <STRING>
owner <STRING>
review_img_url <STRING>
review_body <STRING>
category <STRING>
created_at <STRING> 
votes <NUMBER>

The votes value can be incremented and decremented via the API.

# Comments

Comments are left on reviews and can be posted by users. Comments are automatically assigned to a review by a given review_id. It uses the following keys:

body <STRING>
votes <NUMBER>
author <STRING>
review_id <NUMBER>
created_at <STRING>

Comments can be posted and deleted via the API.

# Users

Users is a saved list of the current users on the database. The keys are:

username <STRING>
name <STRING>
avatar <STRING>


## Setup

# Files

The structure of this app follows an MVC pattern with corresponding tests that uses a test database. The test database is a considerably smaller version of the database that you would use for this app, but follows a very similar format. This allows tests to run much faster.

# Environment Variables

Create .env.test with PGDATABASE=nc_games_test inside for tests.

Create .env.development with PGDATABASE=nc_games inside to use with the real database.

# Package json

The package.json includes a list of dependencies that will be installed when npm install is run.

To set everything up, you need to run the following command in the terminal to install the respected dependencies: 

```
npm install
```

```
npm install express
```

Your scripts section should look something like this:

```
"scripts": {
		"setup-dbs": "psql -f ./db/setup.sql",
		"seed": "node ./db/seeds/run-seed.js",
		"test": "jest",
		"prepare": "husky install",
		"start": "node listen.js",
		"seed-prod": "NODE_ENV=production npm run seed"
	},
```

