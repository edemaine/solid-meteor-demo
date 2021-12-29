import {Meteor} from 'meteor/meteor'
import {Mongo} from 'meteor/mongo'
import {check} from 'meteor/check'

export ToDo = new Mongo.Collection 'todo'

console.log 'Using CoffeeScript library.'

if Meteor.isServer
  Meteor.publish 'todo', -> ToDo.find()

Meteor.methods
  'todo.add': (title) ->
    check title, String
    ToDo.insert {title, created: new Date}
  'todo.del': (id) ->
    check id, String
    ToDo.remove _id: id
