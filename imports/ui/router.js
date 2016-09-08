import { FlowRouter } from 'meteor/kadira:flow-router'
import { BlazeLayout } from 'meteor/kadira:blaze-layout';
import { Meteor } from 'meteor/meteor';

import '../ui/posts/posts.js';
import '../ui/profile/profile.js';


FlowRouter.route('/', {
    name: 'posts',
    action() {
        BlazeLayout.render('App_body', { main: 'posts',
            data: {
                dataSelector: {
                    sort: {
                        by: "date",
                        type: "desc"
                    }
                },
                filter: {
                  private: false
                }
            }
        });
    }
});
FlowRouter.route('/profile', {
    name: 'profile',
    action() {
        BlazeLayout.render('App_body', { main: 'profile' });
    }
});
FlowRouter.route('/posts/public', {
    name: 'posts',
    action() {
        BlazeLayout.render('App_body', { main: 'posts',
            data: {
                filter: {
                    private: false
                }
            }
        });
    }
});
FlowRouter.route('/posts/public/best', {
    name: 'posts',
    action() {
        BlazeLayout.render('App_body', { main: 'posts',
            data: {
                dataSelector: {
                    sort: {
                        by: "votesCount",
                        type: "desc"
                    }
                },
                filter: {
                    private: false
                }
            }
        });
    }
});
FlowRouter.route('/posts/private', {
    name: 'posts',
    action() {
        BlazeLayout.render('App_body', { main: 'posts',
            data: {
                filter: {
                    private: true,
                    owner: Meteor.userId()
                }
            }
        });
    }
});