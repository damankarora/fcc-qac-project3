/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';
const DBdriver = require('../database/dbconfig');

module.exports = function (app) {

  app.route('/api/books')
    .get(function (req, res){
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]

      DBdriver.getBookDetails().then((data)=>{
        res.json(data);
      }).catch((err)=>{
        res.status(503).send();
      })

    })
    
    .post(function (req, res){
      let title = req.body.title;
      if(!title || title === ''){
        return res.send("missing required field title");
      }


      DBdriver.addBookToDB(title).then((data)=>{
        res.json(data);
      }).catch(()=>{
        res.status(503).send();
      })

    })
    
    .delete(function(req, res){
      //if successful response will be 'complete delete successful'
      DBdriver.removeAllBooksFromDB().then(()=>{
        res.send('complete delete successful');
      }).catch(()=>{
        res.status(503).send();
      })
    });



  app.route('/api/books/:id')
    .get(function (req, res){
      let bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}      

      DBdriver.getBookDetails(bookid).then((data)=>{
        res.json(data);
      }).catch((err)=>{
        if (err ==='no book exists'){
          return res.send(err);
        }
        res.status(503).send();
      })
    })
    
    .post(function(req, res){
      let bookid = req.params.id;
      let comment = req.body.comment;
      //json res format same as .get

      if(!comment || comment === ""){
        return res.send("missing required field comment");
      }

      DBdriver.addCommentToBook(bookid, comment).then((data)=>{
        return res.json(data);
      }).catch((err)=>{
        if (err === 'no book exists'){
          return res.send(err);
        }
        res.status(503).send();
      })
    })
    
    .delete(function(req, res){
      let bookid = req.params.id;
      //if successful response will be 'delete successful'
      DBdriver.removeBookFromDB(bookid).then((data)=>{
        return res.send(data);
      })
      .catch((err)=>{
        if (err === "no book exists"){
          return res.send(err);
        }
        res.status(503).send();
      })
    });
  
};
