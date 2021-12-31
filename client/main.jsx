import {createSignal, onCleanup} from 'solid-js';
import {render} from 'solid-js/web';
import {Meteor} from 'meteor/meteor';
import {Session} from 'meteor/session';
import {createFind, createSubscribe, createTracker} from 'solidjs-meteor-data';

import {ToDo} from '/lib/todo.js';

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

function Timer() {
  const [count, setCount] = createSignal(0);
  const timer = setInterval(() => setCount(count() + 1), 1000);
  onCleanup(() => clearInterval(timer));
  return <h2>TIMER: {count}</h2>;
}

function TodoList() {
  const [sort, setSort] = createSignal(-1);
  // Subscription
  createSubscribe('todo');
  // Alternative without library:
  //sub = Meteor.subscribe('todo');
  //onCleanup(() => sub.stop());
  // Query
  const todos = createFind(() => ToDo.find({}, {sort: {created: sort()}}));
  // Display
  let itemInput;
  function onAdd(e) {
    e.preventDefault();
    Meteor.call('todo.add', itemInput.value);
    itemInput.value = '';
  }
  function onDelete(e) {
    const button = e.currentTarget;
    const row = button.parentNode.parentNode;
    Meteor.call('todo.del', row.dataset.id);
  }
  return <div>
    <h2>To-Do List
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

function App() {
  // Use Session variable to remember name across server-triggered reloads.
  const name = createTracker(() => Session.get('name') || 'Solid');
  const setName = (n) => Session.set('name', n);
  // Alternative without library:
  //const [name, setName] = createSignal(Session.get('name') || 'Solid');
  //createEffect(() => Session.set('name', name()));

  return <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <Timer/>
    <TodoList/>
  </>;
}

render(() => <App/>, document.body);
