import React from 'react';
import { FaClipboard, FaGem, FaInbox } from 'react-icons/fa';
import { BiChevronRight } from 'react-icons/bi';
import cashpoint_img_6 from '../assets/images/cash_P_IMG_6.jpg';

const HeroSection: React.FC = () => {
  return (
    <section id="hero" className="relative bg-gray-50 py-20">
      <img
        src={cashpoint_img_6}
        alt=""
        data-aos="fade-in"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black bg-opacity-50 z-10"></div>
      <div className="container mx-auto px-4 relative z-20">
        <div
          className="text-center mb-16"
          data-aos="fade-down"
          data-aos-delay="100"
        >
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-4">
            WELCOME TO CASHPOINT
          </h2>
          <p className="text-xl text-white">
            "One App. Every Transaction. Zero stress."
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div
            className="lg:col-span-1"
            data-aos="zoom-out"
            data-aos-delay="200"
          >
            <div className="bg-white rounded-lg p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                Why cashpoint?
              </h3>
              <p className="text-gray-600 mb-6">
                Because life doesn't wait—and neither should your money. At
                CashPoint, we're more than just a financial service—we're your
                reliable partner in every moment that matters.
              </p>
              <div className="text-center">
                <a
                  href="#about"
                  className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  Learn More <BiChevronRight />
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-3 gap-6">
              <div
                className="text-center"
                data-aos="zoom-out"
                data-aos-delay="300"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <FaClipboard className="text-4xl text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    Speed & simplicity
                  </h4>
                  <p className="text-gray-600">
                    Get access to your cash in minutes—not hours or days.
                  </p>
                </div>
              </div>

              <div
                className="text-center"
                data-aos="zoom-out"
                data-aos-delay="400"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <FaGem className="text-4xl text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    🌐 Anywhere, Anytime Access
                  </h4>
                  <p className="text-gray-600">
                    With 24/7 service and a growing network, CashPoint is always
                    just a click away.
                  </p>
                </div>
              </div>

              <div
                className="text-center"
                data-aos="zoom-out"
                data-aos-delay="500"
              >
                <div className="bg-white rounded-lg p-6 shadow-lg">
                  <FaInbox className="text-4xl text-blue-600 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-800 mb-2">
                    🛡️ Secure & Transparent
                  </h4>
                  <p className="text-gray-600">
                    No hidden fees. No confusing terms. Just honest service
                    backed by cutting-edge security.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
