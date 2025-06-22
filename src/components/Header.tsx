import React from 'react';
import {
  FaEnvelope,
  FaPhone,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaChevronDown,
  FaBars,
} from 'react-icons/fa';

const Header: React.FC = () => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      {/* Top Bar */}
      <div className="bg-blue-600 text-white py-2">
        <div className="container mx-auto px-4 flex justify-center md:justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaEnvelope className="mr-2" />
              <a
                href="mailto:contact@example.com"
                className="hover:text-blue-200"
              >
                contact@example.com
              </a>
            </div>
            <div className="flex items-center">
              <FaPhone className="mr-2" />
              <span>+1 5589 55488 55</span>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-4">
            <a href="#" className="hover:text-blue-200">
              <FaTwitter />
            </a>
            <a href="#" className="hover:text-blue-200">
              <FaFacebook />
            </a>
            <a href="#" className="hover:text-blue-200">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-blue-200">
              <FaLinkedin />
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <a href="#" className="text-2xl font-bold text-blue-600">
          CASHPOINT
        </a>

        <nav className="hidden lg:flex items-center space-x-8">
          <a
            href="#hero"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            About us
          </a>
          <a
            href="#services"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Services
          </a>
          <a
            href="#steps"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Steps
          </a>
          <a
            href="#our_teams"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Our teams
          </a>
          <div className="relative group">
            <button className="flex items-center text-gray-700 hover:text-blue-600 font-medium">
              Other <FaChevronDown className="ml-1" />
            </button>
            <div className="absolute top-full left-0 bg-white shadow-lg rounded-md py-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
              <a
                href="#faq"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
              >
                FAQ
              </a>
              <a
                href="#testimonials"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
              >
                Testimonials
              </a>
              <a
                href="#gallery"
                className="block px-4 py-2 text-gray-700 hover:bg-blue-50"
              >
                Gallery
              </a>
            </div>
          </div>
          <a
            href="#contact"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Contact us
          </a>
        </nav>

        <button className="hidden sm:block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
          DOWNLOAD NOW
        </button>

        <button className="lg:hidden text-gray-700">
          <FaBars size={24} />
        </button>
      </div>
    </header>
  );
};

export default Header;
