/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import db from './sqldb'
import auth from './auth/auth.service'
var stripe = require('stripe')('sk_test_iJGQtNCDSmOSroJKVAlFCdbB')

var CLIENT_ID = 'ca_7Yac6i1E5MoE5YvDGx9tNYRrBq1tKddQ';
var API_KEY = 'sk_test_iJGQtNCDSmOSroJKVAlFCdbB';

var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

var qs = require('querystring');
var request = require('request');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/content', require('./api/content'));
  app.use('/api/rewards', require('./api/reward'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/users', require('./api/user'));
  app.use('/auth', require('./auth'));

  app.post('/register', auth.isAuthenticated(), function(req,res){
    console.log('access: ',req.query)
    var userId = req.body._id
    var data = req.body.data
    stripe.accounts.create(data, function(err,acct){
      if(err){
        console.log('err!!! ', err)
      } else {
        console.log('acct: ', acct)
        db.User.find({
            where: {
              _id: userId
            }
          })
          .then(function(user) {
            if(user){
              console.log('user: ', user)
            } else {
              console.log('no user found bruh')
            }
          });
      }

    })
  })

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
};
