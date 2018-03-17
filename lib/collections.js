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
  'domains.search'(searchTerm){
    if(typeof (searchTerm) === "undefined") return Domains.find({});
    check(searchTerm, String);
    console.log("Domains.find(): ", Domains.find({"domain.keywords": searchTerm}).fetch());
    return Domains.find({"domain.keywords": searchTerm});
  },
});
