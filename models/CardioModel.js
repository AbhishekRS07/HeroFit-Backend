const mongoose = require("mongoose");

const cardioSchema = new mongoose.Schema(
 {
    title:{type:String, required:true},
    image:{type:String, required:true},
    description: {type:String , required:true},
    category: {type:String, required:true},
    price:{type:String}

 },{
    timestamps:true
 }
);

const CardioModel = mongoose.model("cardio",cardioSchema);

module.exports={
    CardioModel
}