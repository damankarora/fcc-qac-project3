const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO, (err)=>{
    if(err){
        console.log("Unable to connect to database", err);
    }else{
        console.log("Database connection successful");
    }
})

const bookSchema = new mongoose.Schema({
    title: String,
    commentcount: Number,
    comments: [String]
})

const Books = mongoose.model('Books', bookSchema);


const addBookToDB = async (title)=>{
    const ourBook = new Books({
      title: title,
      commentcount: 0,
      comments: []
    });
    await ourBook.save();
    return {_id: ourBook['_id'], title: ourBook['title']};    
}

const removeBookFromDB = async (id) =>{
    const ourBook = await Books.findById(id);
    if(!ourBook){
        return "no book exists";
    }
    await Books.findByIdAndDelete(id);
    return "delete successful";
}

const removeAllBooksFromDB = async () => {
    await Books.remove();    
}



const getBookDetails = async (id) => {
    const book = await Books.findById(id);
    if(!book){
        return "no book exists";
    }
    return book;
}

const getAllBooks = async () =>{
    const ourBooks = await Books.find({}, '');
    return ourBooks;
}

const addCommentToBook = (id, comment) => {
    const ourBook = await Books.findById(id);
    ourBook.comments.push(comment);
    await ourBook.save();
    return await getBookDetails(id);
}

module.exports = {
    addBookToDB,
    removeBookFromDB,
    getBookDetails,
    getAllBooks,
    addCommentToBook,
    removeAllBooksFromDB
}