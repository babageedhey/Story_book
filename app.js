const express                       = require('express');
const mongoose                      = require('mongoose');




const app     = express();
const port      = process.env.PORT || 3000;


//Index Page route
app.get('/', (req, res)=>{
    res.send('Index page loading');
})






// Starting the server
app.listen(port, ()=>{
    console.log(`Server started on port ${port}`)
});