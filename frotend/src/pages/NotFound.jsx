// src/pages/NotFound.jsx
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-6">
      <h1 className="text-9xl font-extrabold text-gray-300">404</h1>
      <h2 className="mt-4 text-3xl font-bold text-gray-900">Page Not Found</h2>
      <p className="mt-4 text-lg text-gray-600 text-center max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 px-8 py-4 bg-indigo-600 text-white text-lg font-medium rounded-xl hover:bg-indigo-700 transition"
      >
        Go Back to Dashboard
      </Link>
    </div>
  );
}