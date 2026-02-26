const prisma = require('../config/prisma.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async(req, res) => {
    try{
        const {name, email, password} = req.body;
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await prisma.user.create({
            data:{
                name, email, password:hashedPassword
            }
        });
        res.status(201).json({message: "User created"})
    }catch(error){
        res.status(500).json({error: error.message})
    }
};

const login = async(req, res) =>{
    try{
        const{email, password} = req.body;
        const user = await prisma.user.findUnique({
            where:{email}
        });
        if (!user){
            return res.status(401).json({message: "No user with such email address exists"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch){
            return res.status(401).json({message: "Invalid credentials"});
        }
        const token = jwt.sign(
            {userId: user.id, userRole: user.role},
            process.env.JWT_SECRET,{
                expiresIn:process.env.JWT_EXPIRES_IN
            }
        );
        res.json({token});
    }catch (error){
        res.status(500).json({error: error.message});
    }
};

module.exports = {register, login};