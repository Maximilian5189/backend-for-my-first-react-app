# backend-for-my-first-react-app

## Install
`npm install`

# Serve
`npm start`

# Test
Basic local url: localhost:8000

As a backend, there is no graphical interface implemented. The application serves solely the purpose to provide routes with data to a frontend. 
The route testing is described  in the following.

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
