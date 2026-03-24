import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');

        if (password !== confirmPassword) {
            setErrorMsg("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post('/auth/register', { name, email, password });
            // auto login after register
            const res = await api.post('/auth/login', { email, password });
            login(res.data.token);
            navigate('/dashboard');
        } catch (err) {
            setErrorMsg(err.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
                    Create Account
                </h2>

                {errorMsg && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded mb-4 text-sm">
                        {errorMsg}
                    </div>
                )}

                <input
                    type="text"
                    placeholder="Full Name"
                    required
                    className="w-full p-3 mb-4 border rounded"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    type="email"
                    placeholder="Email"
                    required
                    className="w-full p-3 mb-4 border rounded"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full p-3 mb-4 border rounded"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    required
                    className="w-full p-3 mb-6 border rounded"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-indigo-600 text-white p-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {loading ? "Creating account..." : "Register"}
                </button>

                <p className="text-center text-sm text-gray-500 mt-4">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                        Sign in
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Register;