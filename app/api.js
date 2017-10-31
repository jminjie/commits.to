// --------------------------------- 80chars ---------------------------------->

import app from './express'
import Promise, { sequelize } from '../models/promise'
import parsePromise from '../lib/promise'
// import computeCredit from './latepenalty'

import moment from 'moment-timezone'

// Actions

app.get('/promises/remove/:id(*)', (req, resp) => {
  console.log('remove', req.params);
  // FIXME: refactor/secure this
  Promise.destroy({
   where: {
     id: req.params.id
   }
  })
  .then(function(deletedRows){
    console.log('promise removed', deletedRows);
    resp.redirect('/')
  })
})

app.get('/promises/complete/:id(*)', (req, resp) => {
  Promise.update(
  {
    tfin: sequelize.literal('CURRENT_TIMESTAMP')
  },
  {
   where: {
     id: req.params.id
   }
  })
  .then(function(promise){
    console.log('complete promise', promise);
    resp.redirect('/')
  })
})

app.get('/promises/create/:urtext(*)', (req, resp) => {
  console.log('create', req.params)
  Promise.create(parsePromise(req.params.urtext))
  .then(function(promise){
    console.log('promise created', promise);
    resp.redirect(`/${req.params.urtext}`);
  })
})

// Endpoints

app.get('/promise/:udp/:urtext', function(req, resp) {
  let urtext = req.originalUrl.substr(9)
  Promise.findOne({ where: {urtext}})
    .then(function(promise) {
      console.log('single promise', urtext, promise)
    // resp.write(promise)
    resp.json(promise)
  })

})

app.get('/promises', function(req, resp) {
  var dbPromises = {}
  Promise.findAll({
    order: sequelize.literal('tini DESC')
  }).then(function(promises) {
    // console.log('all promises', promises)
    // create nested array of promises by user:
    promises.forEach(function(promise) { 
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    });
    resp.json(dbPromises);
  })
})

app.get('/promises/:user', function(req, resp) {
  var dbPromises = {};
  Promise.findAll({
   where: {
     user: req.params.user
   },
  }).then(function(promises) {
    console.log('user promises', promises);
    promises.forEach(function(promise) {
      dbPromises[promise.user] = dbPromises[promise.user] || []
      dbPromises[promise.user].push(promise)
    })
    resp.json(dbPromises)
  })
})

// --------------------------------- 80chars ---------------------------------->