import {createSignal, onCleanup} from 'solid-js'
import {render} from 'solid-js/web'
import {Meteor} from 'meteor/meteor'
import {Session} from 'meteor/session'
import {createFind, createSubscribe, createTracker} from 'solid-meteor-data'

import {ToDo} from '/lib/todo.coffee'

## AUTO MODE: Adding the following lines obviates the need for wrapping use of
## Meteor reactive variables in createTracker; instead, createMemo (or just a
## function) suffices.
#import {autoTracker} from 'solidjs-meteor-data/autoTracker'
#autoTracker()

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

TodoList = (props) ->
  [sort, setSort] = createSignal -1
  ## Subscription
  createSubscribe 'todo', -> props.name
  #or: createSubscribe -> Meteor.subscribe 'todo', props.name
  #or: createTracker -> Meteor.subscribe 'todo', props.name
  ## Query
  todos = createFind ->
    ToDo.find {name: props.name}, sort: created: sort()
  ## Display
  itemInput = null
  onAdd = (e) ->
    e.preventDefault()
    Meteor.call 'todo.add', props.name, itemInput.value
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

ComplexTracker = ->
  ## Test createTracker responding to changing Meteor and SolidJS dependencies
  actualStage = 2
  Session.set 'stage', actualStage
  [stage, setStage] = createSignal actualStage
  step = (set) -> setTimeout (->
    set if actualStage >= 7 then actualStage = 2 else ++actualStage
  ), 2000
  trackStage = createTracker ->
    if actualStage & 2
      Session.get 'stage'
      if not (actualStage & 4) or not (actualStage & 1)
        step (s) -> Session.set 'stage', s
    if actualStage & 4
      stage()
      if not (actualStage & 2) or (actualStage & 1)
        step (s) => setStage s
    actualStage
  <div>
    <h2>Reactivity Test Stage {trackStage()}</h2>
    <ul>
      <Show when={trackStage() & 2}><li>Depending on Meteor data</li></Show>
      <Show when={trackStage() & 4}><li>Depending on SolidJS data</li></Show>
      <Show when={trackStage() == 6}><li>Changing Meteor data</li></Show>
      <Show when={trackStage() == 7}><li>Changing SolidJS data</li></Show>
    </ul>
  </div>

App = ->
  ## Use Session variable to remember name across server-triggered reloads.
  name = createTracker -> Session.get('name') or 'Solid'
  #or in auto mode: name = -> Session.get('name') || 'Solid'
  setName = (n) -> Session.set 'name', n
  ## Alternative without library:
  #[name, setName] = createSignal Session.get('name') or 'Solid'
  #createEffect -> Session.set 'name', name()

  <>
    <h1>Minimal Meteor + SolidJS demo</h1>
    <NameInput name={name()} setName={setName}/>
    <Hello name={name()}/>
    <TodoList name={name()}/>
    <Timer/>
    <ComplexTracker/>
  </>

dispose = render (-> <App/>), document.body

# Enable HMR: If this file changes, rerender instead of reloading.
if module.hot
  module.hot.dispose dispose
  module.hot.accept()
