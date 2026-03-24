import {useState} from 'react';
import {useAuth} from '../context/AuthContext.jsx';
import {useNavigate} from 'react-router-dom';
import api from '../services/api';
import { Link } from 'react-router-dom';
const Login = () =>{
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {login} = useAuth();
    const [errorMsg, setErrorMsg] = useState("");
    const navigate = useNavigate();
    const handleSumbit = async(e) =>{
        e.preventDefault();
        setErrorMsg("");
        try{
            const response = await api.post('/auth/login', {email, password});
            login(response.data.token);
            navigate('/dashboard');
        }
        catch(err){
            const message = err.response?.data?.error || "Something went wrong";
            setErrorMsg(message);
        }
    };
    return(
        <div className = "flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit = {handleSumbit} className = "w-auto max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className = "text-2xl from-red-200 font-bold mb-6 text-center text-black-190">
                    Login
                </h2>
                {errorMsg && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                {errorMsg}
                </div>
                )}
                <input 
                type = "email"
                placeholder ="Email"
                className = "w-full p-3 mb-8 border rounded"
                value = {email}
                onChange={(e)=>setEmail(e.target.value)}/>
                <input
                type = "password"
                placeholder = "Enter Password"
                className = "w-full p-3 mb-6 border rounded-3xl"
                value = {password}
                onChange={(e) => setPassword(e.target.value)}/>
                <button type = "submit" className = "w-full bg-amber-600 text-white p-3 rounded-b-lg">
                    Sign In
                </button>
                <p className="text-center text-sm text-gray-500 mt-4">
                    Don't have an account?{' '}
                <Link to="/register" className="text-indigo-600 hover:underline font-medium">
                    Register
                </Link>
</p>
            </form>
        </div>
    );
};

export default Login;