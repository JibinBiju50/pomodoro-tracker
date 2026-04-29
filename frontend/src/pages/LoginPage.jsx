import Navbar from "../components/Navbar";
import Login from "../components/Login";

export default function LoginPage() {
    return(
        <div className="min-h-screen bg-gray-700 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-4 flex flex-col justify-center">
            <Navbar />
            <Login />
        </div>
    )
}