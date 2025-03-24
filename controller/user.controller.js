const userModel = require("../models/user.models.js");
const bcrypt= require("bcrypt");
const jwt = require("jsonwebtoken");

exports.signUp =async(req,res)=>{
    try {
        const {
            name,
            email,
            password,
            accountType
        } =req.body

        if(!name || !email || !password ||!accountType){
            return res.status(403).json({
                success:False,
                message:"All fields are required"

            })
        }

        const existingUser= await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                sucess:false,
                message:"User already exist",
            })
        }

        const hashedPassword= await bcrypt.hash(password,10);

        //create entry into db
        const user =await userModel.create({
            name,
            email,
            password:hashedPassword,
            accountType
        })

        return res.status(200).json({
            success:true,
            message:"user is created successfully",
        })
        
    } catch (error) {
        console.log("problem in user signup");
        return res.status(500).json({
            success:false,
            messaage:"user canot be registered,please try again",
            error:error.message
        })
        
    }
}

exports.createAccount =async(req,res)=>{
    try {
        const {
            name,
            email,
            password,
            accountType
        } =req.body

        if(!name || !email || !password ||!accountType){
            return res.status(403).json({
                success:False,
                message:"All fields are required"

            })
        }

        if (req.user.accountType !== "SuperAdmin") {
            return res.status(403).json({
                success: false,
                message: "Only SuperAdmin can create new accounts"
            });
        }

        // Allowed account types
        const allowedAccountTypes = ["Admin", "Graphics", "Accounts", "Display"];
        if (!allowedAccountTypes.includes(accountType)) {
            return res.status(400).json({
                success: false,
                message: "Invalid account type"
            });
        }


        const existingUser= await userModel.findOne({email});
        if(existingUser){
            return res.status(400).json({
                sucess:false,
                message:"User already exist",
            })
        }


        const hashedPassword= await bcrypt.hash(password,10);

        //create entry into db
        const user =await userModel.create({
            name,
            email,
            password:hashedPassword,
            accountType
        })

        return res.status(200).json({
            success:true,
            message:"user is created successfully",
        })
        
    } catch (error) {
        console.log("problem in user signup");
        return res.status(500).json({
            success:false,
            messaage:"user canot be registered,please try again",
            error:error.message
        })
        
    }
}


exports.login= async(req,res)=>{
    try {
            const {
            email,
            password
                    } =req.body;

        //data validation
        if(!email ||!password){
            return res.status(403).json({
                success:false,
                message:"all fields are required"
            })
        }

        //user check
        const user = await userModel.findOne({email});
        if(!user){
            return res.status(401).json({
                success:false,
                message:"user is not registered ,please signup first"
            })};

            console.log("user is:",user);
        

        
        //generate jwt token 
        if(await bcrypt.compare(password,user.password)){
            const payload = {
                email:user.email,
                id:user.id,
                name:user.name,
                accountType :user.accountType,
            
            }
            console.log("payload is:",payload);
            const token= jwt.sign(payload,process.env.JWT_SECRET,{
                expiresIn:"2h",
                
            });
            user.token=token;
            user.Password=undefined;

            //create cokkies and send response
            const options = {
                expires:new Date(Date.now()+24*60*60*1000),
                httpOnly:true,
            }

            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:"Logged In successfully"
            });


        }
        else{
            return res.status(401).json({
                success:false,
                message:"Password is incorrect",

            });
        }
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            succcess: false,
            message:"Login failure,please try again",
            error:error.message
        })
        
    }
}


exports.getUser= async(req,res)=>{
    try {
        const userInfo = req.user;
        console.log("userInfo is:",userInfo)
        const email = req.user.email;
        const accountType=req.user.accountType;
        const name=req.user.name;
        console.log("email is",email);
        console.log("accountType is:",accountType);
        console.log("name is:",name);
        return res.status(200).json({
            success:true,
            message:"user detail has been fetched successfully",
            name,
            email,
            accountType,
        })

        
    } catch (error) {
        console.log("get user mein problem h",error);
        return res.status(400).json({
            success:false,
            message:"problem in fetching detail of user",
            error:error.message
        })
        
    }
}

exports.changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;
        const userId = req.user.id;

        // Check if both old and new passwords are provided
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: "Both old and new passwords are required.",
            });
        }

        // Fetch the user from the database
        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        // Compare old password
        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: "Old password is incorrect.",
            });
        }

        // Hash new password and update
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password updated successfully.",
        });

    } catch (error) {
        console.error("Error changing password:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong. Please try again.",
            error: error.message,
        });
    }
};

