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
                accountType :user.accountType,
            
            }
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
        const {accountType}= req.body;
        
        //validate accountType
        if(!["Graphics","Accounts","Display"].includes(accountType)){
            return res.status(400).json({
                success:false,
                message:"Invalid Account Type or You are not allowed to access"
            });


        };

        //find User by accountType
        const users = await userModel.find({accountType});

        //check if user exists or not

        if(users.length===0){
            return res.status(404).json({
                success:false,
                message:`No users fond with account type: ${accountType}`,
            });
        }

        //return the user
        return res.status(200).json({
            success:true,
            message:`Users eith accountType: ${accountType}`,
            data:users,
        })

        
    } catch (error) {
        console.log("problem in user fetching");
        return res.status(500).json({
            success:false,
            message:"problem in user fetching",
            error:error.message,
        })
        
    }
}

exports.getUserDetails = async (req, res) => {
    try {
        const { email } = req.body; 

        const user = await userModel.findOne({ email }).select("name email accountType");
         console.log("Searching for user with email:", email);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        
        return res.status(200).json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.log("Error fetching user details", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching user details",
            error: error.message,
        });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const { email, oldPassword, newPassword } = req.body;

        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Old password is incorrect",
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });
    } catch (error) {
        console.log("Error changing password", error);
        return res.status(500).json({
            success: false,
            message: "Error changing password",
            error: error.message,
        });
    }
};


exports.deleteUser =async(req,res)=>{
    try {

        
    } catch (error) {
        
    }
}


