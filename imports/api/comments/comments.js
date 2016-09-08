import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';

export const Comments = new Mongo.Collection('comments');

if(Meteor.isServer) {
    Meteor.publish('comments', function commentsPublication() {
        return Comments.find({});
    });
}

Meteor.methods({
    'comments.insert': function(comment) {
        Comments.insert({
            owner: comment.owner,
            postId: comment.postId,
            content: comment.content,
            date: comment.date
        });
    },
    'comments.remove': function(id) {
        let comment = Comments.findOne({_id: id});
        if(comment && comment.owner === this.userId) {
            Comments.remove({_id: id});
        }
    }
});