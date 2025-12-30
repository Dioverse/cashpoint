import React from 'react';
import { FaTwitter, FaFacebook, FaInstagram, FaLinkedin } from 'react-icons/fa';
import doctors_img_1 from '../assets/images/doctors/doctors-1.jpg';
import doctors_img_2 from '../assets/images/doctors/doctors-2.jpg';
import doctors_img_3 from '../assets/images/doctors/doctors-3.jpg';
import doctors_img_4 from '../assets/images/doctors/doctors-4.jpg';

const TeamSection: React.FC = () => {
  const teamMembers = [
    {
      name: 'Walter White',
      role: 'Chief Executive Officer',
      description:
        "Leading the vision and strategy for CashPoint's growth and innovation.",
      image: doctors_img_1,
    },
    {
      name: 'Sarah Johnson',
      role: 'Chief Technology Officer',
      description:
        'Overseeing all technical aspects and ensuring platform security.',
      image: doctors_img_2,
    },
    {
      name: 'William Anderson',
      role: 'Chief Financial Officer',
      description: 'Managing financial operations and strategic investments.',
      image: doctors_img_3,
    },
    {
      name: 'Amanda Jepson',
      role: 'Head of Operations',
      description:
        'Ensuring smooth day-to-day operations and customer satisfaction.',
      image: doctors_img_4,
    },
  ];

  return (
    <section id="our_teams" className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">OUR TEAM</h2>
          <p className="text-gray-600">Meet the people behind CashPoint</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="flex items-start space-x-4"
              data-aos="fade-up"
              data-aos-delay={100 + index * 100}
            >
              <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-xl font-semibold text-gray-800">
                  {member.name}
                </h4>
                <span className="text-blue-600 font-medium">{member.role}</span>
                <p className="text-gray-600 mt-2">{member.description}</p>
                <div className="flex space-x-2 mt-3">
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaTwitter />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaFacebook />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaInstagram />
                  </a>
                  <a href="#" className="text-gray-400 hover:text-blue-600">
                    <FaLinkedin />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TeamSection;
