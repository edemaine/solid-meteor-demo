import {onPageLoad} from 'meteor/server-render';
import {generateHydrationScript, renderToString} from 'solid-js/web';

import {solid} from '/package.json';
// @ts-ignore Explicit extension to distinguish from other languages
import {App} from '/ui/main.tsx';

import '/lib/todo.ts';

if (solid.ssr) {
  onPageLoad(sink => {
    sink.appendToHead(generateHydrationScript());
    sink.appendToBody(renderToString(() => <App/>));
  });
}
