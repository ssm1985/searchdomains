import { Mongo } from 'meteor/mongo';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

export const Domains = new Mongo.Collection('domains');

if (Meteor.isClient){
  Meteor.subscribe('domains');
}

if (Meteor.isServer){
  Meteor.publish('domains', function (){
    return Domains.find({});
  });
}

Meteor.methods({
  'domains.update'(domain){
    check(domain, Object);
    if(!Meteor.userId()){
      throw new Meteor.Error('Not Authorized');
    }
    Domains.updateOne({
      domain,
      lastEditedAt: new Date(),
      lastEditedBy: Meteor.user().username,
    });
  },
  'domains.update'(domain){
    check(domain, Object);
    if(!Meteor.userId()){
      throw new Meteor.Error('Not Authorized');
    }
    console.log('HERE: ', domain);
    Domains.updateOne({_id: domain._id}, {$set: domain});
  },
  'domains.insert'(domain){
    check(domain, Object);
    if(!Meteor.userId()){
      throw new Meteor.Error('Not Authorized');
    }
    if(domain === ""){
      throw new Meteor.Error('Cannot Submit Empty Value');
    }
    Domains.insert({
      domain,
      createdAt: new Date(),
      owner: Meteor.userId(),
      username: Meteor.user().username,
    });
  },
  'domains.remove'(domain){
    check(domain._id, String);
    Domains.remove(domain._id);
  },
});
