const mongoose = require("mongoose");

const boxingSchema = new mongoose.Schema(
 {
    title:{type:String, required:true},
    image:{type:String, required:true},
    description: {type:String , required:true},
    category: {type:String, required:true}

 },{
    timestamps:true
 }
);

const BoxingModel = mongoose.model("boxing",boxingSchema);

module.exports={
    BoxingModel
}