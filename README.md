# What is this app about

It's a Trello like app that I made for my portfolio.

# What am I using to create the app

I'm using create-react-app for a client side and node and express for server side. Also, I'm using mongodb as a database and bootstrap (take a look on P.P.S.) as a css framework. And air-bnb config for eslint.

# What you can do using the app

Almost all things those you can do with original Trello:

## Boards:
 - create, edit and delete boards
 - switch between boards
 - add users those can see and edit board, cards and leave comments
 - make a board private or public
 - create, edit and delete columns with cards on a board

## Cards
 - create, edit and delete cards
 - leave comments to cards
 - drag cards to another column

## Accounting
 - sign up and log in with email (and log out of course)
 - editing profile: email, nickname, credentials

# How to install
## Configs
To check it out:
  1. create .env file in ./server folder and set `JWT_SECRET` and `IP` as local IP (it's used for creating confirmation and reset password emails).
  2. In src/api.js set your IP in `ip` const on the 4th line.
  3. In package.json put the server ip in `proxy`.
  4. In server/index.js set:
  - `MONGODB_URI_DEV`= (e.g. mongodb://localhost:27017/trello-dev)
  - `MONGODB_URI_TEST`= (e.g. mongodb://localhost:27017/trello-test)
  - `MONGODB_URI_PROD`= (e.g. mongodb://localhost:27017/trello) (for profuction only)
  
  - `BACK_PORT`=port for serving ajax requests
  - `FRONT_PORT`=port for serving static files (for profuction only)

  - `ADDRESS`=address for emails (it's where the app is run, e.g. https://myapp.com) (for production only)
  - `DEV_IP`=local IP for emails (e.g. 192.168.0.10)

  - `JWT_SECRET`= your jwt secret

  5. To send emails I'm using `mailtrap.io` so you need to set in .env:
  - `EMAIL_HOST`
  - `EMAIL_PORT`
  - `EMAIL_USER`
  - `EMAIL_PASS`

## Tools I used
 - Axios
 - Redux
 - Redux-thunk
 - React hooks (~70% of all components are functional and contain React hooks)
 - Custom hooks

## P.S.

This is my first own app that I have made all by myself. I'm not a designer, so it can look not as good as I'd like to. I hope it will be good enough to you consider to invite me to interview.

## P.P.S.

On the project start I picked Twitter bootstrap up for learning it but later I noticed that it's not suitable for my project, so on the halfway to finish I tried to use BEM naming. Due to my mischoice of CSS tool, CSS looks messed and right now I'm working on the improvement of my HTML/CSS skills.


The application has been finished in the March 2020.