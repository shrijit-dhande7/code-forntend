import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { SiLeetcode } from "react-icons/si";
import { FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

const Header = ({ user, handleLogout, COLORS }) => {
  const navigate = useNavigate();

  return (
    <header
      className="fixed top-0 w-full z-50 px-6 py-4 bg-opacity-80 backdrop-blur border-b border-gray-700 flex justify-between items-center"
      style={{ background: COLORS.primary }}
    >
      <NavLink to="/" className="flex items-center gap-2 text-xl font-bold">
        <SiLeetcode className="text-yellow-400" />
        <span className="text-white">Code_Decode</span>
      </NavLink>

      <div className="relative group">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg"
          style={{ background: COLORS.accent }}
        >
          <FaUser />
          <span>{user?.firstName || "Guest"}</span>
        </motion.button>

        <ul
          className="absolute right-0 mt-2 w-48 rounded-lg shadow-xl opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-300"
          style={{ background: COLORS.primary }}
        >
          {/* Profile */}
          <li>
            <NavLink
              to="/profile"
              className="flex items-center gap-2 px-4 py-3 hover:opacity-90 text-base"
              style={{ background: COLORS.secondary }}
            >
              <FaUser /> Profile
            </NavLink>
          </li>

          {/* Admin (if admin) */}
          {user?.role === "admin" && (
            <li>
              <NavLink
                to="/admin"
                className="flex items-center gap-2 px-4 py-3 hover:opacity-90 text-base"
                style={{ background: COLORS.secondary }}
              >
                <FaCog /> Admin
              </NavLink>
            </li>
          )}

          {/* Logout / Login */}
          <li>
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 text-left px-4 py-3 hover:opacity-90 text-base"
                style={{ background: COLORS.secondary }}
              >
                <FaSignOutAlt /> Logout
              </button>
            ) : (
              <button
                onClick={() => navigate("/login")}
                className="w-full flex items-center gap-2 text-left px-4 py-3 hover:opacity-90 text-base"
                style={{ background: COLORS.secondary }}
              >
                <FaSignOutAlt /> Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Header;
