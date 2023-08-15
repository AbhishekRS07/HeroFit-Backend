const mongoose = require("mongoose");

const weightSchema = new mongoose.Schema(
 {
    title:{type:String, required:true},
    image:{type:String, required:true},
    category: {type:String, required:true}

 },{
    timestamps:true
 }
);

const WeightModel = mongoose.model("weight",weightSchema);

module.exports={
    WeightModel
}