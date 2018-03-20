const express                   = require('express');
const mongoose                  = require('mongoose');
const passport                  = require('passport');
const googleStrategy            = require('passport-google-oauth20');
const router                    = express.Router();


//Index router for google authentication
router.get('/google', passport.authenticate('google',{scope: ['profile', 'email']})
);

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),(req, res)=> {
    res.redirect('/dashboard');
  });

module.exports                  = router;