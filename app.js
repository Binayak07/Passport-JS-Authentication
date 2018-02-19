const express = require('express')
const mongoose = require ('mongoose')
const bodyParser = require('body-parser')
const path = require ('path')
const expressValidator = require ('express-validator')
const flash = require('connect-flash')
const session = require('express-session')

//init app
const app = express()

//load view enginer
app.set('view engine','pug')

//setting up middleware / bodyparser
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname,'public')))

//express session middleware setup
app.use(session({
  secret:'keyboard cat',
  resave : true,
  saveInitialized: true
}));

//express validator middleware
app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
    var namespace = param.split('.')
    var root = namespace.shift()
    var formParam = root;

    while(namespace.length){
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}))

//express messages middleware
app.use(require('connect-flash')());
app.use((req,res,next) => 
{
res.locals.messages = require('express-messages')(req, res);
next();
})

//setting up database
mongoose.connect('mongodb://localhost/nodekb');
let db = mongoose.connection;

//check connection
db.once('open',() =>
{
  console.log('connected to mongodb')
})

//check for DB errors
db.on('error',(error)=>
{
  console.log(error)
})

//bring in models
let Article = require('./models/articles')

//route files

let articles = require('./routes/articles');
app.use('/articles', articles)

//home route
app.get('/',(req,res) => {
Article.find({},(error,articles) =>{
  if(error)
  {
    console.log(error)
  }
  else{ 
  res.render('index',{
    title:'Articles',
    articles
        });
    }
});
});


//start server
app.listen(3000,function()
{
  console.log('Server Started');
});

