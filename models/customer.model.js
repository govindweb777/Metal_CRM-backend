const mongoose= require("mongoose");
const customerSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true
    },
    lastName:{
        type:String,
        required:true
    },
    phoneNo:{
        type:String,
        required:true,
        unique: true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
    },
    createdBy:{
        type:String,
        default:null
    },
    address:{
        type:mongoose.Types.ObjectId,
        ref:'Address'
    }
},{timestamps:true});

module.exports= mongoose.model('Customer',customerSchema);