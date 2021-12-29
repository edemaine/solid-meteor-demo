import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export interface TodoItem {
  _id: string,
  title: string,
  created: Date,
}

export const ToDo = new Mongo.Collection<TodoItem>('todo');

console.log('Using TypeScript library.');

if (Meteor.isServer) {
  Meteor.publish('todo', () => ToDo.find());
}

Meteor.methods({
  'todo.add': (title) => {
    check(title, String);
    ToDo.insert({title, created: new Date});
  },
  'todo.del': (id) => {
    check(id, String);
    ToDo.remove({_id: id});
  }
});
