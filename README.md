# Meteor + SolidJS demo

This app is a simple example of using the
[SolidJS reactive framework](https://www.solidjs.com/)
to build your user interface within the
[Meteor full-stack JavaScript platform](https://www.meteor.com/).
It demonstrates the use of two libraries:

* [`edemaine:solid` on Atmosphere](https://github.com/edemaine/meteor-solid)
  enables the SolidJS compiler for JSX notation, including SSR.
* [`solid-meteor-data` on NPM](https://github.com/edemaine/solid-meteor-data/)
  provides helper functions for Meteor reactivity within SolidJS.

Although not demonstrated here, if you have existing
[Blaze](http://blazejs.org) templates to port, you may also be interested in
[`edemaine:solid-meteor-helper`](https://github.com/edemaine/meteor-solid-template-helper/tree/main)
which enables use of SolidJS components within Blaze.

## How To Use

1. [Install Meteor](https://docs.meteor.com/install.html):
   `npm install -g meteor`
2. Clone this repository and `cd` into the directory.
3. Run `npm install`.
4. Run `meteor` to start a dev server.
5. Open `http://localhost:3000`.

To type check the TypeScript code, run `npm run test`
(or `npm install -g typescript` once and then just run `tsc`).

## Overview

Example code is provided in
[TypeScript](https://www.typescriptlang.org/),
[CoffeeScript](https://coffeescript.org/), and
plain JavaScript.

Most of the sample code is in the following files,
which includes a few different components to demonstrate basic signal usage
and interaction with MongoDB via the
[solid-meteor-data library](https://github.com/edemaine/solid-meteor-data/).

* TypeScript: [`ui/main.tsx`](https://github.com/edemaine/solid-meteor-demo/blob/main/ui/main.tsx)
* CoffeeScript: [`ui/main.coffee`](https://github.com/edemaine/solid-meteor-demo/blob/main/ui/main.coffee)
* JavaScript: [`ui/main.jsx`](https://github.com/edemaine/solid-meteor-demo/blob/main/ui/main.jsx)

You can think of these as client-side, but to support SSR, they're actually
shared by the client and server, via corresponding files in the
[`client`](https://github.com/edemaine/solid-meteor-demo/blob/main/client)
and
[`server`](https://github.com/edemaine/solid-meteor-demo/blob/main/server)
directories.

To support the MongoDB examples, the following shared code
(included in both client and server) defines a to-do list collection and
methods for adding and removing to-do items.

* TypeScript: [`lib/todo.ts`](https://github.com/edemaine/solid-meteor-demo/blob/main/lib/todo.ts)
* CoffeeScript: [`lib/todo.coffee`](https://github.com/edemaine/solid-meteor-demo/blob/main/lib/todo.coffee)
* JavaScript: [`lib/todo.js`](https://github.com/edemaine/solid-meteor-demo/blob/main/lib/todo.js)

Running `meteor` will execute the TypeScript code by default.
To change to running the CoffeeScript or JavaScript code,
modify the relevant lines of
[`package.json`](https://github.com/edemaine/solid-meteor-demo/blob/main/package.json)
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

The [`server`](https://github.com/edemaine/solid-meteor-demo/blob/main/server)
code implements Server-Side Rendering (SSR) by default, meaning that the initial
HTML bundle includes a server-rendered version of the page.  You can turn this
off by setting `ssr: false` in the corresponding `solid` option.

The code demonstrates support for
[Hot Module Replacement](https://docs.meteor.com/packages/hot-module-replacement.html):
if you change `client/main.{tsx,coffee,jsx}`, then that module will reload and
the interface will rerender, without having to refresh the browser.
Unfortunately, modifying `ui/main.{tsx,coffee,jsx}` still triggers a refresh
[[Issue #2](https://github.com/edemaine/solid-meteor-demo/issues/2).]

## Components

The demo has six main components:

* `App` is the top-level component.  It builds a signal-like `[name, setName]`
  that is actually stored via Meteor's `Session` state, so it persists across
  hot code updates.
* `NameInput` asks for the user's name, and stores it in the specified
  signal-like `[name, setName]`.
* `Hello` just says &ldquo;Hello &lt;name&gt;&rdquo;
  (illustrating basic reactivity)
* `TodoList` renders a to-do list that is local to the user (changing the name
  switches to a different to-do list), allowing addition and deletion of items.
  It logs a message when each to-do item gets rendered to the DOM, so you can
  see what rerenders when.
  Notably, if you add an item, only the added item renders.
  The sort order can be switched between increasing and decreasing order;
  notably, this does not cause any to-do items to render
  (just their DOM order changes).
* `Timer` shows the number of seconds since the component loaded
  (illustrating the use of `setInterval` effects).
* `ComplexTracker` is a test to make sure that `createTracker` can correctly
  change its dependencies between SolidJS and Meteor Tracker state.
  It should cycle from stage 2 to stage 7 over the course of 12 seconds.
