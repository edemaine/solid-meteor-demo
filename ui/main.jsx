import {For, Show, createSignal, onCleanup} from 'solid-js';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {createFind, createSubscribe, createTracker} from 'solid-meteor-data';

import {ToDo} from '/lib/todo.js';

export function Hello(props) {
  return <h2>Hello {props.name}!</h2>;
}

export function NameInput(props) {
  return <div>
    Enter your name:
    <input value={props.name}
     onInput={(e) => props.setName(e.currentTarget.value)}/>
  </div>;
}

export function Timer() {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return <h2>TIMER: {count}</h2>;
}

export function TodoList(props) {
  const [sort, setSort] = createSignal(-1);
  // Subscription
  createSubscribe('todo', () => props.name);
  //or: createSubscribe(() => Meteor.subscribe('todo', props.name));
  //or: createTracker(() => Meteor.subscribe('todo', props.name));
  // Query. Skip on server because we don't know the right name.
  const todos = Meteor.isServer ? () => [] : createFind(() =>
      ToDo.find({name: props.name}, {sort: {created: sort()}}));
  // Display
  let itemInput;
  function onAdd(e) {
    e.preventDefault();
    Meteor.call('todo.add', props.name, itemInput.value);
    itemInput.value = '';
  }
  function onDelete(e) {
    const button = e.currentTarget;
    const row = button.parentNode.parentNode;
    Meteor.call('todo.del', row.dataset.id);
  }
  return <div>
    <h2>To-Do List for {props.name}
      <button onClick={() => setSort((s) => -s)}>
        Sort {sort() > 0 ? '🠗' : '🠕'}
      </button>
    </h2>
    <form onSubmit={onAdd}>
      <input ref={itemInput}/>
      <input type="submit" onClick={onAdd} value="Add Item"/>
    </form>
    <table>
      <For each={todos()}>{(todo) => {
        if (Meteor.isClient)
          console.log(`Rendering ${todo._id} '${todo.title}'`);
        return <tr data-id={todo._id}>
          <td>{todo.title}</td>
          <td class="date">{todo.created.toLocaleString()}</td>
          <td><button onClick={onDelete}>Delete</button></td>
        </tr>;
      }}</For>
    </table>
  </div>;
}

export function ComplexTracker() {
  // Test createTracker responding to changing Meteor and SolidJS dependencies
  let actualStage = 2;
  Session?.set('stage', actualStage);
  const [stage, setStage] = createSignal(actualStage);
  const step = (set) =>
    setTimeout(() => set(actualStage >= 7 ? actualStage = 2 : ++actualStage),
      2000);
  const trackStage = createTracker(() => {
    if (actualStage & 2) {
      Session?.get('stage');
      if (!(actualStage & 4) || !(actualStage & 1))
        step((s) => Session?.set('stage', s));
    }
    if (actualStage & 4) {
      stage();
      if (!(actualStage & 2) || actualStage & 1)
        step((s) => setStage(s));
    }
    return actualStage;
  });
  return <div>
    <h2>Reactivity Test Stage {trackStage()}</h2>
    <ul>
      <Show when={trackStage() & 2}><li>Depending on Meteor data</li></Show>
      <Show when={trackStage() & 4}><li>Depending on SolidJS data</li></Show>
      <Show when={trackStage() === 6}><li>Changing Meteor data</li></Show>
      <Show when={trackStage() === 7}><li>Changing SolidJS data</li></Show>
    </ul>
  </div>;
};

export function App() {
  // Use Session variable to remember name across server-triggered reloads.
  const name = createTracker(() => Session?.get('name') || 'Solid');
  const setName = (n) => Session?.set('name', n);
  // Alternative without library:
  //const [name, setName] = createSignal(Session?.get('name') || 'Solid');
  //createEffect(() => Session?.set('name', name()));

  return <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <TodoList name={name()}/>
    <Timer/>
    <ComplexTracker/>
  </>;
}

if (module.hot) module.hot.decline();
