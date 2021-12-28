import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'

export const ToDo = new Mongo.Collection('todo');

if (Meteor.isServer) {
  Meteor.publish('todo', () => ToDo.find());
}

Meteor.methods({
  'todo.add': (title) => {
    check(title, String);
    ToDo.insert({title, created: new Date});
  },
  'todo.del': (id) => {
    check(title, String);
    ToDo.remove({_id: id});
  }
});
