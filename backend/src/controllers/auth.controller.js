const authService = require('../services/auth.service');
const register = async(req, res)=>{
    try{
        await authService.register(req.body);
        res.status(201).json({message: "User created"});
    }catch(error){
        res.status(error.statusCode || 500).json({ error: error.message });
    }
};
const login = async(req, res) =>{
    try{
        const {email, password} = req.body;
        const result = await authService.login({email, password});
        res.json({token: result.token});
    }catch(error){
        res.status(error.statusCode || 500).json({ error: error.message });
    }
}; 
const getProfile = async(req, res)=>{
    try{
        const userId = req.user.id;
        const profile = await authService.getProfile(userId);
        res.status(201).json({profile});
    }catch(error){
        res.status(error.statusCode||500).json({error: error.message});
    }
}
module.exports = {register, login, getProfile};