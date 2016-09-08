import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { Gravatar } from 'meteor/jparker:gravatar';

import './profile.html';

console.log('Template: profile');
Template.profile.onCreated(function postsOnCreated() {
    Meteor.subscribe('users');
});

Template.profile.helpers({
    gravatarUrl() {
        let user = Meteor.users.findOne({id: this.userId}),
            email = user.emails[0].address,
            md5Hash = Gravatar.hash(email);
        return Gravatar.imageUrl(md5Hash, {
            size: 50,
            default: 'mm'
        });
    },
    userInfo() {
        return Meteor.users.findOne({id: this.userId});
    }
});