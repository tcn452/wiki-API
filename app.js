const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');

const app = express();



app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"))

mongoose.connect("mongodb://localhost:27017/wikiDB", {useNewUrlParser: true});
mongoose.createConnection("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true})

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
    .get(function(req,res) {
        Article.find(function(err,foundArticles) {
            if (!err) {
                res.send(foundArticles);
            }else {
                res.send(err);
            }
        });
    })
    .post(function(req,res) {
        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });

        newArticle.save(function (err) {
            if (err) {
                res.send(err);
            } else {
                res.send("Success!");
            }
        })
    })
    .delete(function(req,res) {
            Article.deleteMany(function(err){
                if (!err) {
                    res.send("Deleted!");
                } else {
                    res.send(err);
                }
            });
        });
//////////////////////////////// Specific Articles //////////////////////////////////////////////////
  app.route("/articles/:articleName")
      .get(function(req,res) {
        Article.findOne({title:req.params.articleName},function(err,foundArticle){
            if (!err){
                res.send(foundArticle)
            }else{
                res.send(err)
            }
        })
      })
      .put(function(req,res) {
        Article.replaceOne({title:req.params.articleName},{title:req.body.title,content:req.body.content},function(err){
            if (!err){
                res.send("Updated!")
            }else{
                res.send(err)
    }
});
      })
      .patch(function(req,res) {
          Article.updateOne({title:req.params.articleName}, req.body, function(err){
              if (!err){
                  res.send("Updated!")
              }else{
                  res.send(err)
              }
          })
      })
      .delete(function(req,res) {
          Article.deleteOne({title:req.params.articleName},function(err){
              if (!err){
                  res.send("Deleted!")
              }else{
                  res.send(err)
              }
          })
      });








app.listen(3000,function(){
    console.log('Express server listening on port 3000');
})