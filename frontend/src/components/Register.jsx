import { useState } from "react"
import { authService } from "../service/service";
import {Link, useNavigate} from 'react-router-dom';

export default function Register() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await authService.register(username, password);
            navigate('/');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-72px)] px-2 sm:px-4">
            <div className="w-full max-w-xs sm:max-w-sm md:max-w-md bg-gray-800 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 mx-auto">
                <h1 className="text-xl sm:text-2xl md:text-3xl text-white font-bold mb-4 sm:mb-6 md:mb-8 text-center">Create Account</h1>
                
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium">Username</label>
                        <input
                            type="text"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium">Password</label>
                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
                        />
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="text-gray-300 text-sm font-medium">Confirm Password</label>
                        <input
                            type="password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 transition-all"
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
                        className="mt-2 bg-green-600 text-white p-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-green-600/50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-green-500/25"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <p className="text-gray-400">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}