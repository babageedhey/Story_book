const express                   = require('express');
const router                    = express.Router();





//Index Page route
router.get('/', (req, res)=>{
    res.render('index/home');
})

router.get('/dashboard', (req, res)=>{
    res.send('Dashboard Page');
})

module.exports                  = router;