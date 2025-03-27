const mongoose= require("mongoose");

const userSchema =new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true

    },
    password:{
        type:String,
        required:true
    },
    accountType:{
        type:String,
        enum:["Admin","SuperAdmin","Graphics","Accounts","Display"],
        required:true,
    },
    isActive:{
        type:Boolean,
        default:"false",

    }

    
})

module.exports=mongoose.model("User",userSchema);