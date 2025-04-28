import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "cloudinary";
import nodemailer from "nodemailer";


export const register = async (req, res) => {
    try {
        const {  username,email, password, gender } = req.body;
        if (!email || !username || !password || !gender) {
            return res.status(400).json({ message: "All fields are required" });
        }
        
        const file = req.file;
        console.log(file);
        const fileUrl = getDataUri(file);

        let option;

        const type = "image";
        if (type === "reel") {
            option = {
                resource_type: "video",
            };
        } else {
            option = {
                resource_type: "image",
            };
        }

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);
        const user = await User.findOne({ username });
        if (user) {
            return res.status(400).json({ message: "Username already exit try different" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

       

        await User.create({
            email,
            username,
            password: hashedPassword,
            profilePhoto: myCloud.secure_url,
            gender
        });
        await sendConfirmationEmail(username, email);
        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
};
export const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "All fields are required" });
        };
        const user = await User.findOne({ username }).select(-password);

        if (!user) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect username or password",
                success: false
            })
        };
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
    
        const tokenData = {
            userId: user._id
        };

        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpOnly: false, sameSite: 'strict' }).json({
            userWithoutPassword
        });

    } catch (error) {
        console.log(error);
    }
}
export const logout = (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "logged out successfully."
        })
    } catch (error) {
        console.log(error);
    }
}
export const getOtherUsers = async (req, res) => {
    try {
        const loggedInUserId = req.id;
        const otherUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        return res.status(200).json(otherUsers);
    } catch (error) {
        console.log(error);
    }
}

const sendConfirmationEmail = async (username, email) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "xs332000@gmail.com",
                pass: "ohej afzp plna vhlu",
            },
        });

        const mailOptions = {
            from: 'xs332000@gmail.com',
            to: email,
            subject: "Welcome to Instapic – Your Social Space ✨",
            html: `
              <div style="font-family: Arial, sans-serif; background-color: #fafafa; padding: 30px;">
                <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                  <h2 style="color: #262626; text-align: center;">👋 Welcome to <span style="color:#E1306C;">Instapic</span>, ${username}!</h2>
                  <p style="color: #555; font-size: 16px; line-height: 1.5; text-align: center;">
                    Thank you for joining our community! Your account has been created successfully.
                  </p>
                  <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;" />
                  <p style="color: #555; font-size: 15px; text-align: center;">
                    Start exploring, sharing moments, and connecting with others just like you.
                  </p>
                  <div style="text-align: center; margin-top: 30px;">
                    <a href="https://your-app-url.com" style="background-color: #E1306C; color: white; padding: 12px 25px; border-radius: 5px; text-decoration: none; font-weight: bold;">Go to your feed</a>
                  </div>
                  <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">
                    This is an automated message. Please do not reply to this email.
                  </p>
                </div>
              </div>
            `,
          };
          

        await transporter.sendMail(mailOptions);
        console.log("Confirmation email sent to:", email);
    } catch (error) {
        console.error("Error sending email:", error);
    }
};

export const addBio=async(req,res)=>{
    try{
        const {biodata}=req.body;
       
        const userdata=await User.findById(req.id);
        if(!userdata){
            return res.status(401).json({message:"User is not found" , success:false});
        } 
      
        userdata.bio=biodata;
        await userdata.save();
        console.log(userdata);
       res.status(200).json({messsage:"Successfull" , success:true,userdata});
    }catch(error){
        console.log(error);
        res.status(500).json({message:error, success:false })
    }
}

export const getUserdataById=async(req,res)=>{
   try{
     const findId=req.params.id;
     const userdata=await User.findById(findId);
     if(!userdata){
         return res.status(401).json({message:"user is not found" , success:false});
     }
     return res.status(200).json({message:"User found",success:true,userdata});
   }catch(error){
    res.status(500).json({message:"server error" ,success:true});
   }
}

export const getauthUser = async (req, res) => {
    try {
        console.log(req.id); // Check if req.id is actually coming
        const userdata = await User.findById(req.id);

        if (!userdata) {
            return res.status(401).json({
                message: "User not found",
                success: false
            });
        }

        return res.status(200).json({
            message: "User found",
            success: true,
            userdata
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};




// export const addstatus = async (req, res) => {
//     try {
//         const id = req.id; // your user id from auth middleware
//         const user = await User.findById(id);

//         if (!user) {
//             return res.status(404).json({ message: "User not found", success: false });
//         }

        

//         const file = req.file;
//         const fileUrl = getDataUri(file);

//         let option;

//         const type = req.query.type;
//         if (type === "reel") {
//             option = {
//                 resource_type: "video",
//             };
//         } else {
//             option = {
//                 resource_type: "image",
//             };
//         }

//         const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);
//         user.status = myCloud.secure_url;  
//         user.statusUpdatedAt = new Date();
//         await user.save();

//         res.status(200).json({ message: "Status updated successfully", success: true, user });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "Server error", success: false });
//     }
// };
export const addstatus = async (req, res) => {
    try {
        console.log("Uploaded file:", req.file); // Log the file to inspect it

        const id = req.id;
        const user = await User.findById(id);

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        const file = req.file;
        const fileUrl = getDataUri(file);

        let option;

        const type = req.query.type;
        if (type === "reel") {
            option = {
                resource_type: "video",
            };
        } else {
            option = {
                resource_type: "image",
            };
        }

        const myCloud = await cloudinary.v2.uploader.upload(fileUrl.content, option);

        user.status = myCloud.secure_url;  // Save the URL of the uploaded file
        user.statusUpdatedAt = new Date();
        await user.save();

        res.status(200).json({ message: "Status updated successfully", success: true, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", success: false });
    }
};
