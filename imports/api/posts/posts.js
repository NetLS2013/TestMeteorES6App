import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Votes } from '../votes/votes.js';
import { Comments } from '../comments/comments.js';

export const Posts = new Mongo.Collection('posts');

if(Meteor.isServer) {
    Meteor.publish('posts', function postsPublication() {
        let posts;
        if(this.userId) {
            posts = Posts.find({});
        } else {
            posts = Posts.find({private: false});
        }
        return posts;
    });
    Meteor.publish('allUsers', function allUsersPublication() {
       return Meteor.users.find({}, {fields: {profile: 1, _id: 1, emails: 1}});
    });
}

Meteor.methods({
    'posts.insert': function(post) {
        Posts.insert({
            title: post.title,
            content: post.content,
            date: post.date,
            private: post.private,
            owner: post.owner
        });
    },
    'posts.remove': function(id) {
        let post = Posts.findOne({_id: id});
        if(post.owner == this.userId)
            Posts.remove({_id: id});
    },
    'posts.update': function(post) {
        Posts.update(post._id, {
           $set: {private: post.private}
        });
    }
});