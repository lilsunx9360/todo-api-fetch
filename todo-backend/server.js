 const express = require('express');
 const app = express();
 const mongoose = require('mongoose');
 const cors = require('cors');
//db connection 
 mongoose.connect('mongodb://localhost:27017/mern-app')
 .then(()=>{
    console.log('DB connected succesfully');
 })
.catch((err)=>{
   console.log(err.message);
})

//this line indigating sending data is json format
app.use(express.json());
app.use(cors())

//shema
const shema = new mongoose.Schema({
    title:{
        required :true,
        type:String
    },
    description:String
})

//model cretion
const model = mongoose.model('todo',shema);

//  creating api items
 app.post('/todo',async(req,res)=>{
    const {title,description} = req.body;

   try {
    const tablecreate = new model({title,description});
    await tablecreate.save();
    res.status(201).json(tablecreate);
   } catch (error) {
       console.log(error);
       res.status(500).json({message:error.message});
       
   }
 })

// getting items
 app.get('/todo',async(req,res)=>{
   try {
    const todoprint = await model.find();
    res.json(todoprint)
    
   } catch (error) {
    console.log(error);
    res.status(500).json({message:error.message});
      
   }
 })

 //updating items
 app.put("/todo/:id", async (req, res) => {
    try {
      const { title, description } = req.body;
      const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid ID" });
      }
      const updateVal = await model.findByIdAndUpdate(id, { title, description });
      if (!updateVal) {
        return res.status(404).json({ message: "ID not found" });
      }
      res.json(updateVal);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

  //delete items

  app.delete('/todo/:id',async(req,res)=>{
    try {
    const id = req.params.id;
    await  model.findByIdAndDelete(id);
    res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  })

 const port = 8000;
 app.listen(port,()=>{console.log('welcome'+port);
 })
 
