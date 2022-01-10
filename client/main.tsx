import {render, hydrate} from 'solid-js/web';
import {onPageLoad} from 'meteor/server-render';

import {App} from '/ui/main.tsx';

onPageLoad(() => {
  // Render or hydrate depending on whether SSR is enabled.
  let dispose;
  if (document.querySelector('body > :not(script)')) {
    dispose = hydrate(() => <App/>, document.body);
  } else {
    dispose = render(() => <App/>, document.body);
  }

  // Enable HMR: If this file changes, rerender instead of reloading.
  if (module.hot) {
    module.hot.dispose(dispose);
    module.hot.accept();
  }
});
