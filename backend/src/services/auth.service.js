const prisma = require('../config/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async(userData) => {
        const {name, email, password} = userData;
        const existingUser = await prisma.user.findUnique({where:{email}});
        if (existingUser){
            const error = new Error("Email address is already in use");
            error.statusCode = 400;
            throw error;
        }
        const hashedPassword = await bcrypt.hash(password,10);
        return await prisma.user.create({
            data:{
                name, email, password:hashedPassword
            }
        });
};

const loginUser = async({email, password}) =>{
    const user = await prisma.user.findUnique({where:{email}});
    if (!user){
        const error = new Error("No user with such email address exists");
        error.statusCode = 401;
        throw error;
    }   
    const isMatch = await bcrypt.compare(password, user.password); 
    if (!isMatch){
        const error = new Error("Incorrect password");
        error.statusCode = 401;
        throw error;
    }
    const token = jwt.sign(
        {id: user.id},
        process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
        }
    );
    return {token};
};

const getProfile = async(userId)=>{
    const user = await prisma.user.findUnique({where:{userId},
        select:{
            id:true,
            email:true,
            name:true,
            role:true,
        }
});
    if(!user){
        const error = new Error("User not found");
        error.statusCode = 401;
        throw error;
    }
};
module.exports = {register: registerUser, login: loginUser, getProfile};
