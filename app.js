//jshint esversion6

const express=require("express");
const bodyParser=require("body-parser");
const ejs= require("ejs");
const mongoose= require("mongoose");
 
const app= express();//createing new app instance using express

app.set('view engine','ejs');//ejs as our templating engine
app.use(bodyParser.urlencoded({extended:true}));//body parser to pass our request
app.use(express.static("public"));//using public directory to use our static files such as image
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});
const articleSchema = {
     title:String,
     content:String 
 };
 const Article= mongoose.model("Article",articleSchema);
app.route("/articles")
.get(function(req,res){
    Article.find(function(error,foundArticles){
        console.log(foundArticles);
        res.send(foundArticles);
    });
})
.post(function(req,res){
    console.log(req.body.title);
    console.log(req.body.content);
        const newArticle= new Article({
        title:req.body.title,
        content:req.body.content
    });
    
    newArticle.save(function(err){
    
        if(!err)
        res.send("sucessfully added a new article");
        else
        res.send(err);
    });
    })
.delete(function(req,res){
        Article.deleteMany(function(err){
            if(!err)
            {
                res.send("Successfully delete all the articles ");
            }
            else 
            res.send(err);
        })
        });

app.route("/articles/:articleTitle")
.get(function(req,res){
    Article.findOne({title: req.params.articleTitle},function (err,foundArticle){
        if(foundArticle){
            res.send(foundArticle);
        }
        else{
            res.send("No article matching that title was found");
        }
    });
})
.put(function(req,res){
    Article.findOneAndUpdate(
        {title: req.params.articleTitle},
        {title: req.body.title, content: req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("Successfully updated");
            }
        }
        
    )
})
.patch(function(req,res){
    Article.updateOne(
        {title :req.params.articletitle},
        {$set :req.body},
        function(err){
            if(!err){
                res.send("Successfully completed the patch");
            }
            else{
                res.send(err);
            }
        }
    )
})
.delete(function(req,res){
    Article.deleteOne(
        {title:req.params.articleTitle},
        function(err){
            if(!err){
                res.send("Deleted successfully");
            }
            else{
                res.send(err);
            }
        }
    )
})
 

app.listen(3000,function(){// set our app to listen on port no 3000
    console.log("server started at port 3000");
})
