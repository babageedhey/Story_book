
const googleStrategy                    = require('passport-google-oauth20').Strategy;
const mongoose                          = require('mongoose');
const keys                              = require('./keys');
const User                              = require('../models/Users');


module.exports  = function(passport){
    passport.use(
        new googleStrategy({
            clientID: keys.googleClientID,
            clientSecret: keys.googleClientSecret,
            callbackURL: '/auth/google/callback',
            proxy: true
        }, (accessToken, refreshToken, profile, done)=>{
           // console.log(accessToken);
            //console.log(profile);
            const image = profile.photos[0].value.substring(0,
            profile.photos[0].value.indexOf('?'));

            const newUser = {
                googleID:   profile.id,
                firstName:  profile.name.givenName,
                lastName:   profile.name.familyName,
                email:      profile.emails[0].value,
                image:      image
            }
            //Check for existing Users
            User.findOne({
                googleID: profile.id
            }). then(user =>{
                if (user){
                    done(null, user); 
                } else{
                    //Create user
                    new User(newUser).save()
                    .then(user => done(null, user));
                }
            });
        })
    )
    passport.serializeUser((user, done)=>{
        done(null, user.id);
    })
    passport.deserializeUser((id, done)=>{
        User.findById(id).then(user => done(null, user));
    })
}