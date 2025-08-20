import React from 'react';
import cashpoint_img_1 from '../assets/images/cashpoint_img_1.png';

const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative" data-aos="fade-up" data-aos-delay="200">
            <div className="bg-gray-200 rounded-lg p-8 text-center">
              <img src={cashpoint_img_1} className="img-fluid" alt="" />
              <a
                href="https://www.youtube.com/watch?v=Y7f98aduVJ8"
                className="glightbox pulsating-play-btn"
              ></a>
            </div>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-3xl font-bold text-gray-800 mb-6">About Us</h3>
            <p className="text-gray-600 mb-8">
              CashPoint is your all-in-one solution for seamless airtime
              top-ups, data purchases, bill payments, and secure cryptocurrency
              transactions. Built for ease, speed, and security, CashPoint
              empowers users to manage digital finances and utilities from one
              intuitive platform.
            </p>

            <div className="space-y-6">
              <div>
                <h4 className="text-xl font-semibold text-gray-800 mb-2">
                  Why choose Us
                </h4>
                <h5 className="text-lg font-medium text-blue-600 mb-2">
                  🔁 for seamless transaction
                </h5>
                <p className="text-gray-600">
                  All Your Transactions in One Place - Top up airtime, purchase
                  data, pay electricity or cable bills, and buy crypto—right
                  from your phone.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong>🔐 Bank-Level Security</strong>
                    <p className="text-gray-600">
                      End-to-end encryption keeps your funds and data safe.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong>⚡ Fast & Seamless Transactions</strong>
                    <p className="text-gray-600">
                      Get airtime, pay bills, or trade crypto — all in seconds.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong>📱 Modern & Intuitive Interface</strong>
                    <p className="text-gray-600">
                      Built for simplicity, speed, and ease of use on any
                      device.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong>💼 Dual Wallet System</strong>
                    <p className="text-gray-600">
                      Manage your naira wallet and crypto wallet with ease.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <div>
                    <strong>🌍 Made for Nigerians</strong>
                    <p className="text-gray-600">
                      Tailored services that meet your local needs.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
