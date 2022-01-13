import {onPageLoad} from 'meteor/server-render';
import {generateHydrationScript, renderToString, renderToStream} from 'solid-js/web';
import {Transform} from 'stream';

import {solid} from '/package.json';
import {App} from '/ui/main.tsx';

import '/lib/todo.ts';

if (solid.ssr) {
  onPageLoad(sink => {
    sink.appendToHead!(generateHydrationScript());
    // Simple string-based server rendering
    //sink.appendToBody!(renderToString(() => <App/>));
    // Streaming server rendering
    const stream = new Transform({
      // @ts-ignore Unused argument 'encoding'
      transform(data: any, encoding: any, callback: any) {
        callback(null, data);
      }
    });
    renderToStream(() => <App/>).pipe(stream);
    sink.appendToBody!(stream);
  });
}
