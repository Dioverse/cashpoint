import React from 'react';
import {
  FaHeartbeat,
  FaPills,
  FaHospitalUser,
  FaDna,
  FaWheelchair,
  FaNotesMedical,
} from 'react-icons/fa';

const ServicesSection: React.FC = () => {
  const services = [
    {
      icon: FaHeartbeat,
      title: 'Crypto Trading',
      description:
        'Easily buy, sell, and monitor your crypto assets with a built-in wallet.',
      delay: 100,
    },
    {
      icon: FaPills,
      title: 'Wallet & Transfers',
      description:
        'Send and receive both naira and crypto securely, with full control over your wallet.',
      delay: 200,
    },
    {
      icon: FaHospitalUser,
      title: '🎁 Rewards / Cashback / Referral Bonuses',
      description:
        'Incentivize engagement by offering referral programs and cashback in crypto for airtime/bill purchase.',
      delay: 300,
    },
    {
      icon: FaDna,
      title: 'Bills Payment',
      description:
        'Pay for electricity, cable TV, education, and more — anytime, anywhere.',
      delay: 400,
    },
    {
      icon: FaWheelchair,
      title: 'Airtime and Data',
      description:
        'Instantly buy airtime and data bundles for all Nigerian networks.',
      delay: 500,
    },
    {
      icon: FaNotesMedical,
      title: '🧾 Transaction History',
      description:
        'Clean and detailed logs of airtime, data, bill payments, crypto transfers and swaps with filters for easy tracking.',
      delay: 600,
    },
  ];

  return (
    <section id="services" className="py-20">
      <div className="container mx-auto px-4">
        <div
          className="text-center mb-16"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Services</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow"
                data-aos="fade-up"
                data-aos-delay={service.delay}
              >
                <IconComponent className="text-4xl text-blue-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600">{service.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
