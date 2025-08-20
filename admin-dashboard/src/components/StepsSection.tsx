import React from 'react';
import cashpoint_img_2 from '../assets/images/cashpoint_img_2.png';

const StepsSection: React.FC = () => {
  return (
    <section id="steps" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">STEPS</h2>
        </div>

        <div
          className="grid lg:grid-cols-2 gap-12 items-center"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div>
            <h5 className="text-2xl font-bold text-gray-800 mb-6">
              🏧 Steps for Using a Crypto Cashpoint (ATM)
            </h5>
            <p className="text-gray-600 mb-6">
              1. Find a Crypto ATM - Use directories like Coin ATM Radar to
              locate nearby ATMs. Check which cryptocurrencies the ATM supports
              and continue with the procedure. (Bitcoin, Ethereum, USDT, etc.)
            </p>
            <h5 className="text-xl font-semibold text-gray-800 mb-4">
              🏗 Steps to Set Up a Crypto
            </h5>
            <p className="text-gray-600">
              [Additional steps content would go here]
            </p>
          </div>
          <div className="text-center">
            <div className="bg-gray-200 rounded-lg p-8">
              <img src={cashpoint_img_2} alt="" className="img-fluid" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
