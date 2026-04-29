import { useState, useEffect } from "react";
import { profileService, authService } from "../service/service";
import { useNavigate } from "react-router-dom";

export default function Profile() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Username form
    const [newUsername, setNewUsername] = useState("");
    const [usernameError, setUsernameError] = useState("");
    const [usernameSuccess, setUsernameSuccess] = useState("");
    const [usernameLoading, setUsernameLoading] = useState(false);

    // Password form
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Delete account
    const [deletePassword, setDeletePassword] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await profileService.getProfile();
                setUser(data.user);
                setNewUsername(data.user.username);
            } catch (err) {
                console.error(err);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [navigate]);

    const handleUsernameUpdate = async (e) => {
        e.preventDefault();
        setUsernameError("");
        setUsernameSuccess("");
        setUsernameLoading(true);

        try {
            const data = await profileService.updateUsername(newUsername);
            setUser(data.user);
            setUsernameSuccess("Username updated successfully!");
        } catch (err) {
            setUsernameError(err.message);
        } finally {
            setUsernameLoading(false);
        }
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (newPassword !== confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        setPasswordLoading(true);

        try {
            await profileService.updatePassword(currentPassword, newPassword);
            setPasswordSuccess("Password updated successfully!");
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err) {
            setPasswordError(err.message);
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleDeleteAccount = async (e) => {
        e.preventDefault();
        setDeleteError("");
        setDeleteLoading(true);

        try {
            await profileService.deleteAccount(deletePassword);
            navigate('/');
        } catch (err) {
            setDeleteError(err.message);
        } finally {
            setDeleteLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-72px)]">
                <p className="text-white text-xl">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] px-4 py-8">
            <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl text-white font-bold text-center mb-8">Profile Settings</h1>

                {/* Account Info */}
                <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
                    <h2 className="text-xl text-white font-semibold mb-4">Account Information</h2>
                    <div className="text-gray-300">
                        <p><span className="text-gray-400">Username:</span> {user?.username}</p>
                        <p><span className="text-gray-400">Member since:</span> {new Date(user?.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Update Username */}
                <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
                    <h2 className="text-xl text-white font-semibold mb-4">Change Username</h2>
                    <form onSubmit={handleUsernameUpdate} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm font-medium">New Username</label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={(e) => setNewUsername(e.target.value)}
                                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Enter new username"
                            />
                        </div>
                        {usernameError && (
                            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {usernameError}
                            </div>
                        )}
                        {usernameSuccess && (
                            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
                                {usernameSuccess}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={usernameLoading}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {usernameLoading ? "Updating..." : "Update Username"}
                        </button>
                    </form>
                </div>

                {/* Update Password */}
                <div className="bg-gray-800 rounded-xl shadow-2xl p-6">
                    <h2 className="text-xl text-white font-semibold mb-4">Change Password</h2>
                    <form onSubmit={handlePasswordUpdate} className="space-y-4">
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm font-medium">Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Enter current password"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm font-medium">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Enter new password"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <label className="text-gray-300 text-sm font-medium">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="p-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                placeholder="Confirm new password"
                            />
                        </div>
                        {passwordError && (
                            <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                                {passwordError}
                            </div>
                        )}
                        {passwordSuccess && (
                            <div className="bg-green-500/20 border border-green-500 text-green-400 px-4 py-3 rounded-lg text-sm">
                                {passwordSuccess}
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={passwordLoading}
                            className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-600/50 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </form>
                </div>

                {/* Delete Account */}
                <div className="bg-gray-800 rounded-xl shadow-2xl p-6 border border-red-500/30">
                    <h2 className="text-xl text-red-400 font-semibold mb-4">Danger Zone</h2>
                    {!showDeleteConfirm ? (
                        <button
                            onClick={() => setShowDeleteConfirm(true)}
                            className="w-full bg-red-600/20 text-red-400 border border-red-500 p-3 rounded-lg font-semibold hover:bg-red-600 hover:text-white transition-all duration-200"
                        >
                            Delete Account
                        </button>
                    ) : (
                        <form onSubmit={handleDeleteAccount} className="space-y-4">
                            <p className="text-gray-300 text-sm">
                                This action cannot be undone. Enter your password to confirm.
                            </p>
                            <div className="flex flex-col gap-2">
                                <label className="text-gray-300 text-sm font-medium">Password</label>
                                <input
                                    type="password"
                                    value={deletePassword}
                                    onChange={(e) => setDeletePassword(e.target.value)}
                                    className="p-3 rounded-lg bg-gray-700 text-white border border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                                    placeholder="Enter your password"
                                />
                            </div>
                            {deleteError && (
                                <div className="bg-red-500/20 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
                                    {deleteError}
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowDeleteConfirm(false);
                                        setDeletePassword("");
                                        setDeleteError("");
                                    }}
                                    className="flex-1 bg-gray-600 text-white p-3 rounded-lg font-semibold hover:bg-gray-500 transition-all duration-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={deleteLoading}
                                    className="flex-1 bg-red-600 text-white p-3 rounded-lg font-semibold hover:bg-red-700 disabled:bg-red-600/50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                    {deleteLoading ? "Deleting..." : "Delete Forever"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
