import { Accounts } from 'meteor/accounts-base';

Accounts.ui.config({
  requestPermissions: {},
  extraSignupFields: [{
    fieldName: 'userName',
    fieldLabel: 'User name',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your user name");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'firstName',
    fieldLabel: 'First name',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your first name");
        return false;
      } else {
        return true;
      }
    }
  }, {
    fieldName: 'lastName',
    fieldLabel: 'Last name',
    inputType: 'text',
    visible: true,
    validate: function(value, errorFunction) {
      if (!value) {
        errorFunction("Please write your last name");
        return false;
      } else {
        return true;
      }
    }
  }]
});