import {onPageLoad} from 'meteor/server-render';
import {generateHydrationScript, renderToString} from 'solid-js/web';

import {solid} from '/package.json';
import {App} from '/ui/main.jsx';

import '/lib/todo.js';

if (solid.ssr) {
  onPageLoad(sink => {
    sink.appendToHead(generateHydrationScript());
    sink.appendToBody(renderToString(() => <App/>));
  });
}
