const mongoose= require("mongoose");

const orderSchema=new mongoose.Schema({
    orderId:{
        type:String,
        unique:true

    },
    customer:{
        type:mongoose.Types.ObjectId,
        ref:'Customer',
        required:true


    },

    requirements:{
        type:String,
    },

    dimensions:{
    type:String,

    },

    status:{
        type:String,
        enum:["New","Assigned","InProgress","PendingApproval","Approved","InWorkQueue","Completed","Billed",'Paid'],
        default:"New"
    },

    image:[{
        type:String,
        }],
    

    assignedTo:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    approvedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    },

    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',

    },
    customerName:{
        type:String,
        required:true
    },
    created: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the current date if not provided
    }

},{timeStamp:true});


module.exports=mongoose.model("Order",orderSchema);
