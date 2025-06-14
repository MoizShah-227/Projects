import  Prisma  from '../lib/Prisma.js';
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';


export const register = async (req, res) => {
  const { name, cnic, dob, phone, email, password } = req.body;
  try {
    const age = calculateAge(dob);
    if (age < 18) {
      return res.status(400).json({ message: '❌ You are underage. Minimum age is 18.' });
    }

    // Convert to MM/DD/YYYY format
    const dateObj = new Date(dob);
    const formattedDOB = `${
      (dateObj.getMonth() + 1).toString().padStart(2, '0')
    }/${
      dateObj.getDate().toString().padStart(2, '0')
    }/${
      dateObj.getFullYear()
    }`;

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await Prisma.user.create({
      data: {
        name,
        cnic,
        dob: formattedDOB, // ✅ Store in MM/DD/YYYY format
        phone,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong', error: err });
  }
};




export const login=async (req,res)=>{
    const {email ,password}= req.body;
    try{

        const user = await Prisma.user.findUnique({
            where:{email}
        });


        if(!user) return res.status(401).json({message:"Invalid Credentials!"});
        
        //CHECK THE PASSWORD
        const isPasswordValid = await bcrypt.compare(password,user.password);

        
        
        if(!isPasswordValid) return res.status(401).json({message:"Invalid Credentials!"});
        
        // res.status(500).json({message:"Login "});
        
        //SEND THE COOKIE TOKEN
        const age= 1000*60*60*24*7;

        
        const token = jwt.sign({
            id:user.id,
            // isAdmin:true,
        },process.env.JWT_KEY,{expiresIn:age})

        

        const {password:userpassword , ...userInfo} =user;

        // res.cookie("token",token,{
        //     httpOnly:true,
        //     secure:true,
        //     sameSite: 'None',
        //     domain:'https://clinic-web-six.vercel.app',
        //     maxAge:age
        // }).status(200).json(userInfo)
        
        res.status(200).json({
            token,
            user: userInfo
        });

    
    }catch(err){
        res.status(500).json({message:err});

    }
}

export const logout=async (req,res)=>{
    res.clearCookie("token").status(200).json({message:"Logout"})
}

export const verification=async(req,res)=>{
    const { email, otpcode,userid} = req.body;
    console.log(userid);
    try{
        
        const user = await Prisma.saveotp.findUnique({
            where:{email}
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if the OTP matches
        if (user.otp === otpcode) {
        const age= 1000*60*60*24*7;
            const token = jwt.sign({
                id:userid,
                // isAdmin:false,
            },process.env.JWT_KEY,{expiresIn:age})
            
            res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            maxAge:age})
            
            return res.status(200).json({ message: 'OTP verified successfully' });


        } else {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

    }catch(err){
        res.status(500).json({message:err});

    }

}

export const forgotPassword=async (req,res)=>{
    const {email}= req.body;
    try{

        const user = await Prisma.user.findUnique({
            where:{email}
        });

        const otp= genOTP();
        resetPassword(otp,email);

        res.status(200).json(otp)
    }catch(err){
        res.status(500).json("Invalid Email!");
    }
}

function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  // If birth month/day hasn't occurred yet this year, subtract 1
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}