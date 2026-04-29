import { useState } from "react"
import { authService } from "../service/service";
import {Link, useNavigate} from 'react-router-dom';


export default function Login() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try{
            await authService.login(username, password);
            navigate('/');
        } catch (err){
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-2 sm:px-4">
        <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mx-auto">
            <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-4 sm:mb-6 md:mb-8 text-center">Welcome Back</h1>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm font-medium">Username</label>
                    <input 
                        type="text" 
                        value={username} 
                        placeholder="Enter your username" 
                        onChange={(e) => setUsername(e.target.value)} 
                        className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />    
                </div>

                <div className="flex flex-col gap-2">
                    <label className="text-gray-300 text-sm font-medium">Password</label>
                    <input 
                        type="password" 
                        value={password} 
                        placeholder="Enter your password" 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    />
                </div>

                {error && (
                    <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <button 
                    type="submit" 
                    disabled={loading} 
                    className="mt-2 bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-blue-500/25"
                >
                    {loading ? "Signing in..." : "Sign In"}
                </button>
            </form>

            <div className="mt-6 text-center">
                <p className="text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    </div>
  )
}