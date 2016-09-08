import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const UsersList = new Mongo.Collection('usersList');
if(Meteor.isServer) {
    Meteor.publish('usersList', function usersPublication() {
        console.log(Meteor.users.find({}, {fields: {emails: 1, profile: 1}}).fetch());
        return Meteor.users.find({}, {fields: {emails: 1, profile: 1}});
    });
}