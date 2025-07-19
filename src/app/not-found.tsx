import Link from "next/link";

export default function Custom404() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center p-4">
            <h1 className="text-6xl font-bold text-red-500 mb-4">404</h1>
            <p className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</p>
            <p className="text-gray-600 mb-6">
                The page you’re looking for doesn’t exist or has been moved.
            </p>
            <Link href="/home">
                <button className="text-white bg-blue-600 hover:bg-blue-700">
                    Go to Editor
                </button>
            </Link>
        </div>
    );
}