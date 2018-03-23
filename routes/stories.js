const express                                = require('express');
const router                                 = express.Router();
const {ensureAuthenticated, ensureGuest}     = require('../helpers/auth');
const Story                                  = require('../models/Story');
const User                                   = require('../models/Users');
//View all Stories
router.get('/', (req, res)=>{
    Story.find({status: 'public'})
    .sort({date: 'desc'})
    .populate('user')
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
    Story.findOne({_id: req.params.id})
    .populate('user')
    .populate('comments.commentUser')
    .then(story =>{
        if(story.status == 'public'){
            res.render('stories/show', {story: story})
        } else {
            if(req.user){
                if(user.id == story.user._id){
                    res.render('stories/show', {story: story})
                } else{
                    res.redirect('/stories');
                }
            } else{
                res.redirect('/stories');
            }
        }
    })
})

//Show Stories from a particular User
router.get('/user/:userId', (req, res)=>{
    Story.find({user: req.params.userId, status: 'public'})
    .populate('user')
    .then(stories =>{
        res.render('stories/index', {stories: stories});
    })
})

//LoggedIn User story
router.get('/my', ensureAuthenticated, (req, res)=>{
    Story.find({user: req.user.id}) 
    .populate('user')
    .then(stories =>{
        res.render('stories/index', {stories: stories});
    })
})

//Show Form for adding Stories
router.get('/add', ensureAuthenticated, (req, res)=>{
    res.render('stories/add');
})
//Show form for Editing former stories
router.get('/edit/:id', ensureAuthenticated, (req, res)=>{
    Story.findOne({_id: req.params.id})
    
    .then(story =>{
        if(story.user != req.user.id){
            res.redirect('/stories');
        } else {
            res.render('stories/edit', {story: story});
        }
       
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
        //New Values 
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

 // Delete Story
 router.delete('/:id', (req, res)=>{
     Story.remove({_id: req.params.id})
     .then(() => {
        res.redirect('/dashboard');
     })
 })

 //Add Comment
 router.post('/comment/:id', (req,res)=>{
     Story.findOne({
         _id: req.params.id
     })
     .then(story =>{
        const newComment = {
            commentBody: req.body.commentBody,
            commentUser: req.user.id
        }

        //Add to Story Array
        story.comments.unshift(newComment);

        story.save()
        .then(story =>{
            res.redirect(`/stories/show/${story.id}`);
        })
     })
 })

module.exports              = router;