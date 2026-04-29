import Navbar from "../components/Navbar";
import Profile from "../components/Profile";

export default function ProfilePage() {
    return(
        <div className="min-h-screen bg-gray-700 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-4 flex flex-col justify-center">
            <Navbar />
            <Profile />
        </div>
    )
}
