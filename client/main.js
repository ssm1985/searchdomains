import { Template } from 'meteor/templating';
import { Domains } from '../lib/collections.js';
import { Accounts } from 'meteor/accounts-base';
import { Session } from 'meteor/session';

import './main.html';

Accounts.ui.config({
  passwordSignupFields: 'USERNAME_ONLY'
});

Template.body.helpers({
});

Template.edit.helpers({
  edit(){

  }
});
Template.edit.events({
  'submit .edit-form': function(){
    // Meteor.call('domains.update', domain);
    // Close modal
    console.log('Event', event);
    $('#addModal').modal('close');
    return false;
  },
});

Template.add.events({
  'submit .add-form': function(){
    event.preventDefault();
    const target = event.target;
    const domain = target.text;
    let tld = "";
    let tldFlag = false;

    // Convert all strings to lower case except the domain itself
    for (i = 2; i < domain.length; i++) {
      domain[i].value = domain[i].value.toLowerCase();
    }
    // Extract the TLD
    for (i = 0; i < domain[0].value.length; i++) {
      if (domain[0].value[i] ===".") {
        tldFlag = true;
      }
      if (tldFlag) {
        tld = tld.concat(domain[0].value[i]);
      }
      if (i === domain[0].value.length - 1) tldFlag = false;
    }
    // Load all form fields into object and send to DB
    const domainFields = {
      domain: domain[0].value,
      dateCreated: domain[1].value,
      keywords: [
        domain[2].value,
        domain[3].value,
        domain[4].value,
        domain[5].value,
        domain[6].value,
        domain[7].value,
        domain[8].value,
        domain[9].value
      ],
      tld: tld,
    };
    Meteor.call('domains.insert', domainFields);
    // Reset form
    for (i = 0; i < domain.length; i++) {
      domain[i].value ="";
    }
    // Close modal
    $('#addModal').modal('close');
    return false;
  },
});

Template.domain.events({
  'click .delete-note': function(){
    Meteor.call('domains.remove', this);
    return false;
  },
  // 'click .edit-note': function(){
  //   Meteor.call('domains.edit', this);
  // }
});

Template.searchForm.events({
  'submit .search-form': function(){
    event.preventDefault();
    const searchTerm = event.target.text.value;
    Session.set('query', searchTerm);
  }
});

Template.searchForm.helpers({
  domains(){
    const searchTerm = Session.get('query');
    if (searchTerm) {
      return Domains.find({"domain.keywords": searchTerm});
    }
    else {
      return Domains.find({});
    }
  },
});
