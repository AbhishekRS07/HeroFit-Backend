const mongoose = require("mongoose");

const yogaSchema = new mongoose.Schema(
 {
    title:{type:String, required:true},
    image:{type:String, required:true},
    description: {type:String , required:true},
    price: {type:String , required:true},
    category: {type:String, required:true}

 },{
    timestamps:true
 }
);

const YogaModel = mongoose.model("yoga",yogaSchema);

module.exports={
    YogaModel
}