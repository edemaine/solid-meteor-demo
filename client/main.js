import {createEffect, createRef, createSignal, onCleanup} from 'solid-js';
import {render} from 'solid-js/web';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';

function Hello(props) {
  return <h2>Hello {props.name}!</h2>;
}

function NameInput(props) {
  return <div>
    Enter your name:
    <input value={props.name}
     onInput={(e) => props.setName(e.target.value)}/>
  </div>;
}

function Timer(props) {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return <h2>TIMER: {count}</h2>;
}

function ToDo(props) {
  const sub = Meteor.subscribe('todo');
  onCleanup(() => sub.stop());
}

function App(props) {
  const [name, setName] = createSignal(Session.get('name') || 'Solid');
  createEffect(() => Session.set('name', name()));
  return <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <Timer/>
    <ToDo/>
  </>;
}

render(App, document.body);
