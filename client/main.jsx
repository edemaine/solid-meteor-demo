import {render, hydrate} from 'solid-js/web';
import {onPageLoad} from 'meteor/server-render';

import {App} from '/ui/main.jsx';

// AUTO MODE: Adding the following lines obviates the need for wrapping use of
// Meteor reactive variables in createTracker; instead, createMemo (or just a
// function) suffices.
//import {autoTracker} from 'solidjs-meteor-data/autoTracker';
//autoTracker();

let dispose;
const renderApp = () => {
  // Render or hydrate depending on whether SSR is enabled.
  if (document.querySelector('body > :not(script)')) {
    console.log('Hydrating from SSR');
    dispose = hydrate(() => <App/>, document.body);
  } else {
    console.log('Rendering from scratch');
    dispose = render(() => <App/>, document.body);
  }
};
onPageLoad(renderApp);

// Enable HMR: If this file changes, rerender instead of reloading.
if (module.hot) {
  module.hot.dispose(() => dispose && dispose());
  module.hot.accept();
}
