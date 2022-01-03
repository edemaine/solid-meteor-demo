import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export interface TodoItem {
  _id: string,
  name: string,  // name of user who created item (whose to-do list it's in)
  title: string, // item content
  created: Date, // date item was created
}

export const ToDo = new Mongo.Collection<TodoItem>('todo');

console.log('Using TypeScript library.');

if (Meteor.isServer) {
  // Each user name has a to-do list.  Index and subscribe by name.
  ToDo.createIndex({name: 1});
  Meteor.publish('todo', (name) => {
    check(name, String);
    return ToDo.find({name});
  });
}

Meteor.methods({
  'todo.add': (name, title) => {
    check(name, String);
    check(title, String);
    ToDo.insert({name, title, created: new Date});
  },
  'todo.del': (id) => {
    check(id, String);
    ToDo.remove({_id: id});
  }
});
