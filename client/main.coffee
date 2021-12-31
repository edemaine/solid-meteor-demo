import {createSignal, onCleanup} from 'solid-js'
import {render} from 'solid-js/web'
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session'
import {createFind, createSubscribe, createTracker} from 'solidjs-meteor-data'

import {ToDo} from '/lib/todo.coffee'

Hello = (props) ->
  <h2>Hello {props.name}!</h2>

NameInput = (props) ->
  <div>
    Enter your name:
    <input value={props.name}
     onInput={(e) -> props.setName(e.target.value)}/>
  </div>

Timer = ->
  [count, setCount] = createSignal 0
  timer = setInterval (-> setCount count() + 1), 1000
  onCleanup -> clearInterval(timer)
  <h2>TIMER: {count}</h2>

TodoList = ->
  [sort, setSort] = createSignal -1
  ## Subscription
  createSubscribe 'todo'
  ## Alternative without library:
  #sub = Meteor.subscribe 'todo'
  #onCleanup -> sub.stop()
  ## Query
  todos = createFind -> ToDo.find {}, sort: created: sort()
  ## Display
  itemInput = null
  onAdd = (e) ->
    e.preventDefault()
    Meteor.call 'todo.add', itemInput.value
    itemInput.value = ''
  onDelete = (e) ->
    button = e.currentTarget
    row = button.parentNode.parentNode
    Meteor.call 'todo.del', row.dataset.id
  <div>
    <h2>To-Do List
      <button onClick={-> setSort (s) -> -s}>
        Sort {if sort() > 0 then '🠗' else '🠕'}
      </button>
    </h2>
    <form onSubmit={onAdd}>
      <input ref={itemInput}/>
      <input type="submit" onClick={onAdd} value="Add Item"/>
    </form>
    <table>
      <For each={todos()}>{(todo) ->
        console.log "Rendering #{todo._id} '#{todo.title}'"
        <tr data-id={todo._id}>
          <td>{todo.title}</td>
          <td class="date">{todo.created.toLocaleString()}</td>
          <td><button onClick={onDelete}>Delete</button></td>
        </tr>
      }</For>
    </table>
  </div>

App = ->
  # Keep name signal synchronized with Meteor Session variable.
  # This preserves the name field across server-triggered reloads.
  ## Use Session variable to remember name across server-triggered reloads.
  name = createTracker -> Session.get('name') or 'Solid'
  setName = (n) -> Session.set 'name', n
  ## Alternative without library:
  #[name, setName] = createSignal Session.get('name') or 'Solid'
  #createEffect -> Session.set 'name', name()

  <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <Timer/>
    <TodoList/>
  </>

render (-> <App/>), document.body
