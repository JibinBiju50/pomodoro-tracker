import Navbar from "../components/Navbar";
import Register from "../components/Register";

export default function RegisterPage() {
    return (
        <div className="min-h-screen bg-gray-700 flex flex-col">
            <Navbar />
            <div className="px-2 sm:px-4 md:px-8 lg:px-16 xl:px-32 py-4 flex flex-col justify-center flex-1">
                <Register />
            </div>
        </div>
    )
}