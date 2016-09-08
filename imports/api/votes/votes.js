import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Votes = new Mongo.Collection('votes');

if(Meteor.isServer) {
    Meteor.publish('votes', function votesPublication() {
        return Votes.find({});
    });
}

Meteor.methods({
    'votes.insert': function(vote) {
       Votes.insert({
           owner: vote.owner,
           postId: vote.postId,
           status: vote.status
       });
    },
    'votes.remove': function(id) {
        Votes.remove(id);
    }
});