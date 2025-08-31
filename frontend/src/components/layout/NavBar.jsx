import React, { useState } from "react";
import { motion } from "framer-motion";

const navLinks = [
  { name: "Home", href: "#" },
  { name: "Features", href: "#" },
  { name: "Docs", href: "#" },
];

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const user = { name: "User", image: null };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[#1a1a1a] border-b border-[#3a3a3a] px-4 sm:px-6 py-4 flex items-center justify-between relative z-20"
    >
      {/* Left: Brand/Logo */}
      <div className="flex items-center">
        <motion.div
          className="flex items-center space-x-3"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <div className="w-8 h-8 bg-[#10a37f] rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="text-xl font-semibold text-white tracking-tight">
            NEBULA AI
          </span>
        </motion.div>
      </div>

      {/* Center: Nav Links (hidden on mobile) */}
      <div className="hidden md:flex gap-6">
        {navLinks.map((link, index) => (
          <motion.a
            key={link.name}
            href={link.href}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="text-gray-300 hover:text-white transition-all duration-200 font-medium relative group px-3 py-2 rounded-lg hover:bg-[#2a2a2a]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {link.name}
            <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-200"></span>
          </motion.a>
        ))}
      </div>

      {/* Right: User Avatar & Hamburger */}
      <div className="flex items-center gap-3">
        {/* Hamburger menu for mobile */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-[#2a2a2a] focus:outline-none transition-all duration-200"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Open menu"
        >
          <svg
            className="w-6 h-6 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* User avatar button */}
        <motion.button
          className="w-10 h-10 rounded-full bg-[#ab68ff] flex items-center justify-center border border-[#3a3a3a] hover:border-[#4a4a4a] transition-all duration-200 shadow-lg"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {user.image ? (
            <img
              src={user.image}
              alt="avatar"
              className="w-full h-full object-cover rounded-full"
            />
          ) : (
            <span className="text-white font-bold text-sm">{user.name[0]}</span>
          )}
        </motion.button>
      </div>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 w-full bg-[#1a1a1a] border-b border-[#3a3a3a] shadow-2xl md:hidden z-30"
          >
            <div className="flex flex-col py-2">
              {navLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                  className="px-6 py-3 text-gray-300 hover:text-white hover:bg-[#2a2a2a] transition-all duration-200 font-medium"
                  onClick={() => setMobileOpen(false)}
                  whileHover={{ x: 5 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
