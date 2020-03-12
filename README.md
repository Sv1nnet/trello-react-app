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
 - editing profile: email, nick, credentials

## Configs

To check it out:
  1) create .env file in "server" folder and set JWT_SECRET and IP as local IP (it's used for creating confirmation and reset password emails).
  2) In src/api.js set your IP in "ip" const on the 4th line.
  3) In package.json put the server ip in proxy.
  4) In server/index.js set correct MONGODB_URI and PORT for process.env.
  5) To send emails I'm using mailtrap.io so you need to set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS in .env.

## P.S.

This is my first own app that I have made all by myself. I'm not a designer, so it can look not as good as I'd like to. I hope it will be good enough to you consider to invite me to interview. I'm looking for a trainee/junior position!

## P.P.S.

On the project start I picked Twitter bootstrap up for learning it but later I noticed that it's not suitable for my project, so on the halfway to finish I tried to use BEM naming. Due to my mischoice of CSS tool, CSS looks messed and right now I'm working on the improvement of my HTML/CSS skills.
