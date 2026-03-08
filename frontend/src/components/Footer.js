import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-r from-slate-900 via-sky-900 to-slate-900 text-white overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-72 h-72 bg-sky-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-sky-600 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-sky-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10">
        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-8 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
            {/* Brand Section - 45% width */}
            <div className="lg:col-span-5 space-y-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="rounded-xl p-3 flex items-center space-x-3">
                  <img src="/shoeracklogo.png" alt="SHOERACK" className="w-12 h-12 animate-pulse" style={{filter: 'drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 40px #ffffff)'}} />
                  <img src="/shoeracktext.png" alt="SHOERACK" className="h-10 animate-pulse" style={{filter: 'drop-shadow(0 0 10px #ffffff) drop-shadow(0 0 20px #ffffff) drop-shadow(0 0 40px #ffffff)'}} />
                </div>
              </Link>
              <p className="text-gray-300 leading-relaxed text-sm sm:text-base font-bold">
                Your ultimate destination for premium footwear.<br />Step into style, comfort, and quality.
              </p>
              <div className="flex space-x-4">
                {['facebook', 'twitter', 'instagram', 'youtube'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300 hover:scale-110"
                  >
                    <span className="text-sm font-bold">{social[0].toUpperCase()}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links - ~18% width */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Quick Links</h3>
              <ul className="space-y-2">
                {[
                  { name: 'Home', path: '/' },
                  { name: 'Products', path: '/products' },
                  { name: 'Cart', path: '/cart' },
                  { name: 'Profile', path: '/profile' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block font-bold"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories - ~18% width */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Categories</h3>
              <ul className="space-y-2">
                {['Sneakers', 'Formal', 'Sports', 'Casual'].map((category) => (
                  <li key={category}>
                    <Link
                      to={`/products?category=${category}`}
                      className="text-gray-300 hover:text-white transition-colors duration-200 hover:translate-x-1 transform inline-block font-bold"
                    >
                      {category}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info - ~25% width */}
            <div className="lg:col-span-3 space-y-4">
              <h3 className="text-lg sm:text-xl font-bold text-white">Contact Us</h3>
              <div className="space-y-3 text-gray-300 text-sm sm:text-base font-bold">
                <p className="flex items-center space-x-2">
                  <span>📧</span>
                  <span>support@shoerack.com</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📞</span>
                  <span>+91 75730 72000</span>
                </p>
                <p className="flex items-center space-x-2">
                  <span>📍</span>
                  <span>Surat, Gujarat, India</span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 sm:py-6 pb-6 sm:pb-8">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
              <div className="text-gray-300 text-xs sm:text-sm">
                © 2025 SHOERACK. All rights reserved.
              </div>
              <div className="flex flex-wrap justify-center sm:justify-end gap-4 sm:gap-6 text-xs sm:text-sm">
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Privacy Policy
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Terms of Service
                </a>
                <a href="#" className="text-gray-300 hover:text-white transition-colors duration-200">
                  Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;