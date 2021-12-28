# Meteor + SolidJS demo

This app is a simple example of using the
[SolidJS reactive framework](https://www.solidjs.com/)
to build the user interface within the
[Meteor full-stack JavaScript platform](https://www.meteor.com/).

## How To Use

1. [Install Meteor](https://docs.meteor.com/install.html):
   `npm install -g meteor`
2. Clone this repository and `cd` into the directory.
3. Run `npm install`.
3. Run `meteor` to start a dev server.
4. Open `http://localhost:3000`.

## How It Works

The main magic that turns on the SolidJS compiler is the `babel` setting in
[`package.json`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/package.json).
(But note that this doesn't yet handle Server-Side Rendering; see
[issue #1](https://github.com/edemaine/meteor-solidjs-demo/issues/1).)

Most of the sample code is in
[`client/main.js`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/client/main.js).
There are a few different components to demonstrate basic signal usage
and interaction with MongoDB.

To support the MongoDB examples,
[`lib/todo.js`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/lib/todo.js)
(included in both client and server) defines support for a to-do list.
