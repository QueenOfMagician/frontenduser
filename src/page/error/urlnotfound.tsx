import { motion } from 'framer-motion'
import { Home, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function NotFound() {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex flex-col items-center justify-center p-4">
      <motion.div
        className="text-6xl mb-8"
        animate={{ rotate: isHovered ? [0, -10, 10, -10, 10, 0] : 0 }}
        transition={{ duration: 0.5 }}
      >
        <span role="img" aria-label="Confused face">
          😕
        </span>
      </motion.div>
      <motion.h1
        className="text-4xl font-bold text-gray-800 mb-4 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Oops! Page Not Found
      </motion.h1>
      <motion.p
        className="text-xl text-gray-600 mb-8 text-center max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        We couldn't find the page you're looking for. It might have been moved or doesn't exist.
      </motion.p>
      <motion.div
        className="relative"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <motion.div
          className="absolute inset-0 bg-blue-600 rounded-lg"
          initial={false}
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        />
        <Link
          to="/"
          className="relative z-10 inline-flex items-center px-6 py-3 text-lg font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <Home className="w-5 h-5 mr-2" />
          Return Home
        </Link>
      </motion.div>
      <motion.div
        className="mt-12 flex items-center text-gray-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Search className="w-5 h-5 mr-2" />
        <span>Try searching for what you need</span>
      </motion.div>
    </div>
  )
}