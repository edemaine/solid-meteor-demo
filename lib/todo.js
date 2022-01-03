import {Meteor} from 'meteor/meteor';
import {Mongo} from 'meteor/mongo';
import {check} from 'meteor/check';

export const ToDo = new Mongo.Collection('todo');

console.log('Using JavaScript library.');

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
