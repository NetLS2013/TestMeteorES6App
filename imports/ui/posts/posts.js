import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { _ } from 'meteor/underscore';
import { Posts } from '../../api/posts/posts.js';
import { Votes } from '../../api/votes/votes.js';
import { Comments } from '../../api/comments/comments';
import './posts.html';
import './post.html';
import './addPostModal.html';
import '../comments/comments.html';
import '../comments/comment.html';
import '../mainLayout/App_body.js';
import { getUserName } from '../mainLayout/App_body.js';

Template.posts.onCreated(function postsOnCreated() {
   Meteor.subscribe('posts');
   Meteor.subscribe('votes');
   Meteor.subscribe('comments');
   Meteor.subscribe('allUsers');

   Posts.find().observe({
      added: function(newPost) {
       //  let user = Meteor.users.findOne({_id: newPost.owner});
       //  Meteor.userId() != newPost.owner ? BrowserNotification(`New post in TestMeteorES6App by ${user.profile.firstName} ${user.profile.lastName}`, newPost.title) : null;
      }
   });
   Comments.find().observe({
      added: function(newComment) {
       //  let user = Meteor.users.findOne({_id: newComment.owner});
       //  Meteor.userId() != newComment.owner ? BrowserNotification(`New comment in TestMeteorES6App by ${user.profile.firstName} ${user.profile.lastName}`, newComment.content) : null;
      }
   });
   this.state = new ReactiveDict();
   this.state.set('limit', Infinity);
   this.state.set('postsCount', 0);
});
Template.posts.onDestroyed(function postOnDestroyed() {
   const instance = Template.instance();
   instance.state.set('limit', Infinity);
});
Template.posts.helpers({
   postsCount() {
      const instance = Template.instance();
      let count = Posts.find(this.filter).count();
      instance.state.set('postsCount', count);
      return count;
   },
   limit() {
      const instance = Template.instance();
      return instance.state.get('limit');
   },
   posts() {
         const instance = Template.instance();
         let sort = !!this.dataSelector && !!this.dataSelector.sort ? this.dataSelector.sort : null;

         let limit = instance.state.get('limit');
         let postsCursor = Posts.find(this.filter, {skip:0, limit: limit});
         let posts = postsCursor.fetch();
         for (let i = 0; i < posts.length; i++) {
            let votesUp = Votes.find({postId: posts[i]._id, status: true}).count();
            let votesDown = Votes.find({postId: posts[i]._id, status: false}).count();
            posts[i].votesCount = votesUp - votesDown;
            posts[i].comments = Comments.find({postId: posts[i]._id});
            posts[i].commentsCount = posts[i].comments.count();
         }
      posts = sort ? _.sortBy(posts, function(post) {
         return sort.type == 'asc' ? post[sort.by] : -post[sort.by];
      }) : posts;
      return posts;
   },
   showLoadMoreButton() {
      const instance = Template.instance();
      let count = instance.state.get('postsCount'),
          limit = instance.state.get('limit');
      if(count > limit)
          return true;
   }
});

Template.posts.events({
   'click .comments-link > .link'(e) {
      $(e.currentTarget.parentNode.parentNode)
          .find('.comments-template')
          .toggleClass('hidden');
   },
   'click #addPost': function(e) {
      e.preventDefault();
      $('#addPostModal').modal('show');
   },
   'click #addPostModal-add': function() {
      let post = {
        title: $('#addPostModal #post-title').val(),
         content: $('#addPostModal #post-content').val(),
         date: new Date(),
         private: $('#addPostModal #post-private').is(':checked'),
         owner: Meteor.userId()
      };
      Meteor.call('posts.insert', post);
      $('#addPostModal #post-title').val('');
      $('#addPostModal #post-content').val('');
      $('#addPostModal').modal('hide');
   },
   'keydown #addComment'(e) {
      if(e.ctrlKey && e.keyCode == 13) {
         $('.comment-text:focus').val($('.comment-text:focus').val() + '\n');
      } else if(e.keyCode == 13 && $('.comment-text:focus').val() != '') {
         e.preventDefault();
         let comment = {
            owner: Meteor.userId(),
            postId: $('.comment-text:focus').attr('post'),
            content: $('.comment-text:focus').val(),
            date: new Date()
         };
         Comments.insert(comment);
         $('.comment-text:focus').val('');
      }
   },
   'click .vote-like': function(e) {
      let currentPostId = e.currentTarget.parentNode.getAttribute('post-id');
      let checkVote = Votes.findOne({owner: Meteor.userId(), postId: currentPostId});
      console.log(checkVote);
      if(!checkVote) {
         Meteor.call('votes.insert', {
            owner: Meteor.userId(),
            postId: currentPostId,
            status: true
         });
      }
   },
   'click .vote-dislike': function(e) {
      let currentPostId = e.currentTarget.parentNode.getAttribute('post-id');
      console.log(currentPostId);
      let checkVote = Votes.findOne({owner: Meteor.userId(), postId: currentPostId});
      if(!checkVote) {
         Meteor.call('votes.insert', {
            owner: Meteor.userId(),
            postId: currentPostId,
            status: false
         });
      }
   },
   'click .delete-post': function(e) {
      let postId = e.currentTarget.parentNode.getAttribute('post');
      Posts.remove(postId);
   },
   'click .comment-delete': function(e) {
      let commentId = e.currentTarget.getAttribute('comment');
      Comments.remove(commentId);
   },
   'click .posts-loadMore': function(e, instance) {
      instance.state.set('limit', instance.state.get('limit') + 4);
   },
   'click .posts-set-public': function(e) {
      post = Posts.findOne({_id: e.currentTarget.getAttribute('post')});
      post.private = false;
      Posts.update(post._id,
         post
      );
   }
});