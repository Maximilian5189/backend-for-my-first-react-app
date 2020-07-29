# backend-for-my-first-react-app

## Install
`npm install`

# Serve
`npm start`

# Test
Basic local url: localhost:8000

As a backend, there is no graphical interface implemented. The application serves solely the purpose to provide routes with data to a frontend (https://github.com/Maximilian5189/React-frontend). 
The route testing is described  in the following.

# Configure the app
To test locally, a .env file has to be added in the main folder:

`DB_CONNECTION=<ADD CONNECTIONSTRING>

JWT_KEY=<ADD JWT KEY>`

## Connect to MongoDB
The app will only work, if connected to a database. For that purpose, add a connection string to a .env file in the main folder (Get a mongo DB connection string: https://mongoosejs.com/docs/connections.html)

## Add a JWT key
The app relies on authentifcation via tokens, therefore JWT has to be configured. See https://jwt.io/introduction/

# Get Routes:
* /user (Auth needed - see below)
* /data

# Post Routes:
* /user/add

`username: string, password: string, email: string`

* /user/login

`username: string, password: string`

--> A token is returned, which is needed for authentification for the other routes. The token has to be sent as bearer in the authentification http header.

# Patch Routes:

* /user (Auth needed)

`data: [ { id: string, identifier: string } ], password: string, email: string`
