import React from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Contact</h2>
          <p className="text-gray-600">Get in touch with us</p>
        </div>

        <div className="mb-12" data-aos="fade-up" data-aos-delay="200">
          <iframe
            style={{ border: 0, width: '100%', height: '270px' }}
            src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d48389.78314118045!2d-74.006138!3d40.710059!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a22a3bda30d%3A0xb89d1fe6bc499443!2sDowntown%20Conference%20Center!5e0!3m2!1sen!2sus!4v1676961268712!5m2!1sen!2sus"
            frameBorder="0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div
              className="flex items-start space-x-4"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <FaMapMarkerAlt className="text-2xl text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Location
                </h3>
                <p className="text-gray-600">
                  #32, Lucky Way, By Marriage Registry, Ikpoba Hill, Benin City,
                  Edo State Nigeria
                </p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <FaPhone className="text-2xl text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Call Us
                </h3>
                <p className="text-gray-600">+1 5589 55488 55</p>
              </div>
            </div>

            <div
              className="flex items-start space-x-4"
              data-aos="fade-up"
              data-aos-delay="500"
            >
              <FaEnvelope className="text-2xl text-blue-600 mt-1" />
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  Email Us
                </h3>
                <p className="text-gray-600">info@example.com</p>
              </div>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Your Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
                <input
                  type="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Subject"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <textarea
                placeholder="Message"
                rows={6}
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              ></textarea>
              <div className="text-center">
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-8 py-3 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
