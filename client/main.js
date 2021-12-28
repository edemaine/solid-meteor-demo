import {createEffect, createSignal, onCleanup} from 'solid-js';
import {render} from 'solid-js/web';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {Tracker} from 'meteor/tracker';

import {ToDo} from '/lib/todo';

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

function TodoList(props) {
  // Subscription
  const sub = Meteor.subscribe('todo');
  onCleanup(() => sub.stop());
  // Query
  const [todos, setTodos] = createSignal([]);
  Tracker.autorun(() => setTodos(ToDo.find({}, {sort: {created: -1}}).fetch()));
  // Display
  let ref;
  function onAdd(e) {
    e.preventDefault();
    Meteor.call('todo.add', ref.value);
    ref.value = '';
  }
  function onDelete(e) {
    Meteor.call('todo.del', e.target.parentNode.parentNode.dataset.id);
  }
  return <div>
    <h2>To-Do List</h2>
    <form onSubmit={onAdd}>
      <input ref={ref}/>
      <input type="submit" onClick={onAdd} value="Add Item"/>
    </form>
    <table>
      <For each={todos()}>{(todo) =>
        <tr data-id={todo._id}>
          <td>{todo.title}</td>
          <td class="date">{todo.created.toLocaleString()}</td>
          <td><button onClick={onDelete}>Delete</button></td>
        </tr>
      }</For>
    </table>
  </div>;
}

function App(props) {
  // Keep name signal synchronized with Meteor Session variable.
  // This preserves the name field across server-triggered reloads.
  const [name, setName] = createSignal(Session.get('name') || 'Solid');
  createEffect(() => Session.set('name', name()));

  return <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <Timer/>
    <TodoList/>
  </>;
}

render(App, document.body);
