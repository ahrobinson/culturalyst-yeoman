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
    //create stripe acct for artists
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
              //add stripe acct info to db
              console.log('acct:', user.dataValues.account);
              console.log('acct:', user.account)
              // user.dataValues.account = JSON.stringify(acct);
              console.log('newacct:', user.dataValues.account);
              req.method = 'get'
              return res.redirect('/')
            } else {
              console.log('no user found bruh')
            }
          });


      }

    })
  })

  app.post('/charge', function(req, res){
    var amount = req.body.amount
    var artistId = req.body._id
    //for subscriptions
    var recurring = req.body.recurring
    //find Artist by ID

    db.User.find({
        where: {
          _id: artistId
        }
      })
      .then(function(user) {
        console.log('user: ', user)
        console.log('useracct: ', JSON.parse(user.dataValues.account))
        if(user){
          //if custID
          if(req.body.customer){
            //create charge
            stripe.charges.create({
              amount: amount,
              currency: 'usd',
              customer: customer
            }, function(err, charge){
                //store charge to db for user/artist dashboard
            })
          } else {
            //create cutomer from card token
            return stripe.customers.create({
              source: req.body.token
            }, function(err, customer){
              if(err){
                console.log('err: ', err)
              }
              console.log('customer: ',customer)
              //create charge from cust id
              return stripe.charges.create({
                amount: amount,
                currency: 'usd',
                customer: customer.id,
                destination: JSON.parse(user.dataValues.account).id,
                application_fee: 500
              }, function(err, charge){
                if(err){
                  console.log('err: ', err)
                }
                console.log('charges: ', charge)
                //save charge to db for user/artist dashboard
              })
            })
          }
        } else {
          console.log('no user found bruh')

        }
      });
      req.method = 'get'
      res.redirect('/')
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
