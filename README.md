# Meteor + SolidJS demo

This app is a simple example of using the
[SolidJS reactive framework](https://www.solidjs.com/)
to build the user interface within the
[Meteor full-stack JavaScript platform](https://www.meteor.com/).
It uses the
[solidjs-meteor-data library](https://github.com/edemaine/solidjs-meteor-data/)
built for this very purpose, and serves as a demo of that library.

## How To Use

1. [Install Meteor](https://docs.meteor.com/install.html):
   `npm install -g meteor`
2. Clone this repository and `cd` into the directory.
3. Run `npm install`.
4. Run `meteor` to start a dev server.
5. Open `http://localhost:3000`.

## How It Works

The main magic that turns on the SolidJS compiler is the `babel` setting in
[`package.json`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/package.json).
(But note that this doesn't yet handle Server-Side Rendering; see
[issue #1](https://github.com/edemaine/meteor-solidjs-demo/issues/1).)

Example code is provided in
[TypeScript](https://www.typescriptlang.org/),
[CoffeeScript](https://coffeescript.org/), and
plain JavaScript.

Most of the sample code is in the following client-side files,
which includes a few different components to demonstrate basic signal usage
and interaction with MongoDB via the
[solidjs-meteor-data library](https://github.com/edemaine/solidjs-meteor-data/).

* TypeScript: [`client/main.tsx`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/client/main.tsx)
* CoffeeScript: [`client/main.coffee`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/client/main.coffee)
* JavaScript: [`client/main.jsx`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/client/main.jsx)

To support the MongoDB examples, the following shared code
(included in both client and server) defines a to-do list collection and
methods for adding and removing to-do items.

* TypeScript: [`lib/todo.ts`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/lib/todo.ts)
* CoffeeScript: [`lib/todo.coffee`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/lib/todo.coffee)
* JavaScript: [`lib/todo.js`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/lib/todo.js)

Running `meteor` will execute the TypeScript code by default.
To change to running the CoffeeScript or JavaScript code,
modify the relevant lines of
[`package.json`](https://github.com/edemaine/meteor-solidjs-demo/blob/main/package.json)
to the following replacement lines:

<table>
<tr><th>CoffeeScript</th><th>TypeScript</th></tr>
<tr><td>

```json
  "meteor": {
    "mainModule": {
      "client": "client/main.jsx",
      "server": "server/main.js"
    },
```

</td><td>

```json
  "meteor": {
    "mainModule": {
      "client": "client/main.coffee",
      "server": "server/main.coffee"
    },
```

</td></tr></table>
