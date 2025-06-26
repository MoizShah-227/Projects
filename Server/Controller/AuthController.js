import  Prisma  from '../lib/Prisma.js';
import bcrypt from 'bcryptjs';


export const register = async (req, res) => {
  const { name, cnic, dob, phone, email, password, studentClass, section, gender } = req.body;

  try {
    const age = calculateAge(dob);
    if (age < 16) {
      return res.status(400).json({ message: '❌ You are underage. Minimum age is 16.' });
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
        dob: formattedDOB,
        phone,
        email,
        password: hashedPassword,
        class:studentClass, 
        section,             
        gender,              
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
        
        
        

        const {password:userpassword , ...userInfo} =user;
        
        res.status(200).json({user: userInfo});

    
    }catch(err){
        res.status(500).json({message:err});

    }
}

export const logout=async (req,res)=>{
    res.clearCookie("token").status(200).json({message:"Logout"})
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