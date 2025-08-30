import React from 'react';
import { FaUser, FaAward } from 'react-icons/fa';

const StatsSection: React.FC = () => {
  return (
    <section className="bg-gray-50 py-20">
      <div className="container mx-auto px-4">
        <div
          className="grid md:grid-cols-4 gap-8"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="text-center">
            <FaUser className="text-4xl text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">85</div>
            <p className="text-gray-600">Crypto rate</p>
          </div>
          <div className="text-center">
            <FaUser className="text-4xl text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">85</div>
            <p className="text-gray-600">USSD rate</p>
          </div>
          <div className="text-center">
            <FaAward className="text-4xl text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">150</div>
            <p className="text-gray-600">Naira rate</p>
          </div>
          <div className="text-center">
            <FaAward className="text-4xl text-blue-600 mx-auto mb-4" />
            <div className="text-3xl font-bold text-gray-800 mb-2">150</div>
            <p className="text-gray-600">Rewards per transaction</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
