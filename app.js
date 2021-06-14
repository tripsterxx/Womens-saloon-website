// Defining constants for the whole website
const express = require('express');
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const port = 3000;
var cons = require('consolidate');
const mongoose = require('mongoose');


// Connecting to mongoose or mongod
mongoose.connect('mongodb://localhost/shreegurukripa', {useNewUrlParser: true, useUnifiedTopology: true});

// defining mongoose schema 
const sgkSchema = new mongoose.Schema({
     name: String,
     phone: String,
     email: String,
     address: String,
     desc: String
});

var userData = mongoose.model('userData', sgkSchema);

// EXPRESS SPECIFIC STUFF
app.use('/static', express.static('static')) // For serving static files
app.use(express.urlencoded());


// HTML SPECIFIC STUFF

// view engine setup      Setting the template engine as html
app.engine('html', cons.swig)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');


// ENDPOINTS
// Defaults Endpoint for Home Page.
app.get('/', (req, res) => {
     res.status(200).render('home.html');
});

// Endpoint for About_us Page.
app.get('/about', (req, res) => {
     res.status(200).render('about.html');
});

// Endpoint for login Page.
app.get('/login', (req, res) => {
     res.status(200).render('login.html');
});

// Endpoint for Contact_us Page.
app.get('/contact', (req, res) => {
     res.status(200).render("contact.html");
});

app.post('/contact', (req, res)=>{
     if (req.body.name == "",req.body.phone == "",req.body.email == "",req.body.desc == "",req.body.address == ""){
          res.send(`Please fill the form completely dont leave any field!! 
          refill the form -->><a href="/contact"> contact </a> <script>function contactErr(){alert("Kindly enter details in all the fields")} contactErr() </script>`);
     }

     else if(req.body.name, req.body.phone, req.body.email, req.body.desc, req.body.address){
          var myData = new userData(req.body);
          myData.save().then(()=>{
              res.redirect('/');
          }).catch(()=>{
              res.status(400).send(`Something went wrong We are working on the problem.. Until then go to <a href="/"> Home </a>`)
          });
     }
 });

app.get('/infoDownload', function(req,res){
     const file = `${__dirname}/static/images/liquid.jpg`;
     res.download(file);
     // res.send(`Thanks for downloading our info file... Go to home  <a href="/"> Home </a>`)
     // res.redirect('/');
});

// 404 error handling
app.use(function (req, res){
     res.status(404).render("404ErrorNotFound.html");
});

// START THE SERVER
app.listen(port, ()=>{
     console.log(`The application started successfully here-> http://localhost:${port}`);
});