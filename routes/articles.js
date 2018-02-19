const express = require ('express')
const router = express.Router();


//bring in article model
let Article = require('../models/articles')

// add route
router.get('/add',function(req,res)
{
  res.render('add_article',{
    title:"Add Article"
  });
});

//add submit POST route
router.post('/add',(req,res)=>
{
let article = new Article();
article.title=req.body.title;
article.author=req.body.author;
article.image=req.body.imgUrl
article.body=req.body.body;
article.save((err)=>
{
if(err)
{
console.log(err)
}
else
{
  req.flash('success','Article Added Successfully')
  res.redirect('/');
}
})
});

//view an article
router.get('/:id',(req,res) =>
{
  Article.findById(req.params.id,(err,article) =>
  {
    res.render('article',{
      article
    })
  }
);
})

//load edit form
router.get('/edit/:id',(req,res) =>
{
  Article.findById(req.params.id,(err,article)=>
{
  res.render('edit_article',{article,page_title:"Edit Article"}) 
})
})

//post edit form
router.post('/edit/:id',(req,res) => 
{
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.image = req.body.imgUrl;
  article.body = req.body.body;

  let query = {_id:req.params.id}
  Article.update(query,article,(err)=>
{
if(err)
console.log(err);
else
{
req.flash('success','Article Updated Successfully.')
res.redirect('/');
}
}) 
})

//deleting an article
router.delete('/:id',(req,res)=>
{
  let query = {_id:req.params.id}

  Article.remove(query, (err) =>
  {
    if(err)
    console.log(err)
    res.send('success');
  }
)})

//making it accessible outside 
module.exports = router;