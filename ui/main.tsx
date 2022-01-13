import {For, Show, createSignal, onCleanup} from 'solid-js';
import type {Component} from 'solid-js';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {createFind, createSubscribe, createTracker} from 'solid-meteor-data';

import {ToDo} from '/lib/todo.ts';
import type {TodoItem} from '/lib/todo.ts';

export const Hello: Component<{name: string}> = (props) => {
  return <h2>Hello {props.name}!</h2>;
};

export const NameInput: Component<{name: string, setName: (name: string) => void}> =
(props) => {
  return <div>
    Enter your name:
    <input value={props.name}
     onInput={(e) => props.setName(e.currentTarget.value)}/>
  </div>;
}

export const Timer: Component = () => {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return <h2>TIMER: {count}</h2>;
}

export const TodoList: Component<{name: string}> = (props) => {
  const [sort, setSort] = createSignal<number>(-1);
  // Subscription
  createSubscribe('todo', () => props.name);
  //or: createSubscribe(() => Meteor.subscribe('todo', props.name));
  //or: createTracker(() => Meteor.subscribe('todo', props.name));
  // Query. Skip on server because we don't know the right name.
  const todos = Meteor.isServer ? () => [] : createFind<TodoItem>(() =>
      ToDo.find({name: props.name}, {sort: {created: sort()}}));
  // Display
  let itemInput: HTMLInputElement;
  function onAdd(e: Event) {
    e.preventDefault();
    Meteor.call('todo.add', props.name, itemInput.value);
    itemInput.value = '';
  }
  function onDelete(e: Event) {
    const button = e.currentTarget as HTMLButtonElement;
    const row = button.parentNode!.parentNode as HTMLTableRowElement;
    Meteor.call('todo.del', row.dataset.id);
  }
  return <div>
    <h2>To-Do List for {props.name}
      <button onClick={() => setSort((s) => -s)}>
        Sort {sort() > 0 ? '🠗' : '🠕'}
      </button>
    </h2>
    <form onSubmit={onAdd}>
      <input ref={itemInput!}/>
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

export const ComplexTracker: Component = () => {
  // Test createTracker responding to changing Meteor and SolidJS dependencies
  let actualStage = 2;
  Session?.set('stage', actualStage);
  const [stage, setStage] = createSignal<number>(actualStage);
  const step = (set: (s: number) => void): NodeJS.Timeout =>
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

export const App: Component = () => {
  // Use Session variable to remember name across server-triggered reloads.
  const name = createTracker(() => Session?.get('name') || 'Solid');
  const setName = (n: string) => Session?.set('name', n);
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
