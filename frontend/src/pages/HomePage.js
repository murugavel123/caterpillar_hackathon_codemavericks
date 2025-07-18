// src/pages/HomePage.jsx
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-md text-center"
      >
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6">Welcome!</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Access your dashboard by logging in or signing up.
        </p>

        <div className="flex flex-col gap-4">
          <Link to="/login">
            <button className="w-full py-3 px-6 rounded-xl bg-blue-600 text-white text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow">
              Login
            </button>
          </Link>
          <Link to="/signup">
            <button className="w-full py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 text-lg font-semibold hover:bg-blue-50 transition duration-300 shadow">
              Signup
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

export default HomePage;
