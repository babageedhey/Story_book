const express                                = require('express');
const router                                 = express.Router();
const {ensureAuthenticated, ensureGuest}     = require('../helpers/auth');
const Story                                  = require('../models/Story');
const User                                   = require('../models/Users');
//View all Stories
router.get('/', (req, res)=>{
    Story.find({status: 'public'}).populate('user')
    . then(stories =>{
        res.render('stories/index', {stories: stories});
    })
    
})
//Post stories 
router.post('/', ensureAuthenticated ,(req, res)=>{
    let allowComments;

    if(req.body.allowComments){
        allowComments = true;
    } else {
        allowComments = false;
    }

    const newStory = {
        title:          req.body.title,
        body:           req.body.body,
        status:         req.body.status,
        allowComments:  allowComments,
        user:           req.user.id
    }

    new Story(newStory).save()
    .then(story =>{
        res.redirect(`/stories/show/${story.id}`);
    })
})

//Show Single Story
router.get('/show/:id', (req, res)=>{
    Story.findOne({_id: req.params.id}).populate('user')
    .then(story =>{
        res.render('stories/show', {story: story})
    })
})

//Show Form for adding Stories
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('stories/add');
})
//Show form for Editing former stories
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Story.findOne({_id: req.params.id}).populate('user')
    .then(story =>{
        res.render('stories/edit', {story: story});
    });
   
})
 //Update Edit former stories
 router.put('/:id', (req, res)=>{
    Story.findOne({_id: req.params.id})
    .then(story =>{
        let allowComments;

        if(req.body.allowComments){
            allowComments = true;
        } else {
            allowComments = false;
        }
        story.title         = req.body.title;
        story.body          = req.body.body;
        story.status        = req.body.status;
        story.allowComments = allowComments;

        story.save()
        .then(story =>{
            res.redirect(`/stories/show/${story.id}`);
        })
    })
 })

 router.delete('/:id', (req, res)=>{
     Story.remove({_id: req.params.id})
     .then(() => {
        res.redirect('/dashboard');
     })
 })

module.exports              = router;