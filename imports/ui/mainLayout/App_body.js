import { Meteor } from 'meteor/meteor';
import './App_body.html';
import { FlowRouter } from 'meteor/kadira:flow-router';
import 'meteor/zimme:active-route';
import { Template } from 'meteor/templating';
import  '../../api/profile/profile.js';

Template.App_body.onCreated(function App_bodyCreated() {
    Meteor.subscribe('allUsers');
});
export function getUserName(id) {
    let user = Meteor.users.findOne({_id: id});
    if(user) {
        if(user._id == Meteor.userId()) {
            return 'me';
        }
        return `${user.profile.firstName} ${user.profile.lastName} (${user.emails[0].address})`;
    }
};
Template.App_body.helpers({});
Template.App_body.events({
    'click .route'(e) {
        if(!e.currentTarget.attributes.route) {
            console.log('Please, define route');
            return false;
        }
        let routeName = e.currentTarget.attributes.route.value;
        FlowRouter.go(routeName);
    }

});
Template.registerHelper("dateFormat", function(timestamp) {
    let now = new Date();
    let days = now.getDate() < 10 ? '0' + now.getDate() : now.getDate();
    let months = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1);
    let years = now.getFullYear();
    let dateString = `${days}.${months}.${years}`;
    return dateString;
});
Template.registerHelper("dateTimeFormat", function(timestamp) {
    let now = new Date(timestamp),
        seconds = now.getSeconds() < 10 ? '0' + now.getSeconds() : now.getSeconds(),
        minutes = now.getMinutes() < 10 ? '0' + now.getMinutes() : now.getMinutes(),
        hours = now.getHours() < 10 ? '0' + now.getHours() : now.getHours(),
        days = now.getDate() < 10 ? '0' + now.getDate() : now.getDate(),
        months = now.getMonth() < 9 ? '0' + (now.getMonth() + 1) : (now.getMonth() + 1),
        years = now.getFullYear(),
        dateString = `${hours}:${minutes}:${seconds} - ${days}.${months}.${years}`;
    return dateString;
});
Template.registerHelper('getUserName', getUserName);
Template.registerHelper('countColorClass', function(count) {
    if(count < 0) {
        return 'background-red';
    } else if(count > 0) {
        return 'background-blue';
    }
});
Template.registerHelper('isAuthorized', function() {
    return !!Meteor.userId();
});
Template.registerHelper('isOwner', function(id) {
    return Meteor.userId() === id;
});
Template.registerHelper('Oles', function() {
    return true;
});