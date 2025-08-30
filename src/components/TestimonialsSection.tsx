import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import { FaStar, FaQuoteLeft, FaQuoteRight } from 'react-icons/fa';

import 'swiper/css';
import 'swiper/css/pagination';

import testimonials_img_1 from '../assets/images/testimonials/testimonials-1.jpg';
import testimonials_img_2 from '../assets/images/testimonials/testimonials-2.jpg';
import testimonials_img_3 from '../assets/images/testimonials/testimonials-3.jpg';
import testimonials_img_4 from '../assets/images/testimonials/testimonials-4.jpg';
import testimonials_img_5 from '../assets/images/testimonials/testimonials-5.jpg';

const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Mr Ridwan Adio',
      role: 'CEO & Founder',
      quote:
        "Leading a business means staying ahead and CashPoint crypto gives us that edge. It's fast, reliable, and perfectly aligns with our drive for innovation and efficiency. It's not just a payment solution but a strategic advantage.",
      image: testimonials_img_1,
    },
    {
      name: 'Miss Taqiha Ola',
      role: 'Designer',
      quote:
        'I value simplicity and elegance. CashPoint Crypto combines sleek usability with powerful performance, letting me focus on my craft while ensuring smooth, secure transactions with clients worldwide.',
      image: testimonials_img_2,
    },
    {
      name: 'Mr Muhad',
      role: 'Store Owner',
      quote:
        "Running a store means handling countless transactions daily. CashPoint Crypto makes it easy, secure, and fast—plus it opens up a whole new customer base using crypto. It's the future of retail, no question.",
      image: testimonials_img_3,
    },
    {
      name: 'Matt Brandon',
      role: 'Freelancer',
      quote:
        "Freelancing means flexibility—and with CashPoint, I get paid instantly, no matter where my clients are. It's eliminated payment delays and currency hassles. This is the freedom freelancers deserve.",
      image: testimonials_img_4,
    },
    {
      name: 'John Larson',
      role: 'Entrepreneur',
      quote:
        "As an entrepreneur juggling multiple projects, I need tools that work as hard as I do. CashPoint Crypto is seamless, secure, and scalable—helping me grow without limits. It's built for visionaries.",
      image: testimonials_img_5,
    },
  ];

  return (
    <section id="testimonials" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Testimonials
          </h2>
          <p className="text-gray-600">What our users are saying about us</p>
        </div>

        <div data-aos="fade-up" data-aos-delay="200">
          <Swiper
            modules={[Autoplay, Pagination]}
            loop={true}
            speed={600}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
            slidesPerView={1}
            pagination={{
              clickable: true,
              el: '.swiper-pagination',
              bulletClass: 'swiper-pagination-bullet',
              bulletActiveClass: 'swiper-pagination-bullet-active',
            }}
            className="pb-12"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white rounded-lg p-8 shadow-lg max-w-3xl mx-auto">
                  <div className="flex items-center mb-6">
                    <img
                      src={testimonial.image}
                      className="w-20 h-20 rounded-full mr-6 object-cover"
                      alt={testimonial.name}
                    />
                    <div>
                      <h4 className="text-xl font-semibold text-gray-800">
                        {testimonial.name}
                      </h4>
                      <p className="text-gray-500">{testimonial.role}</p>
                      <div className="flex text-yellow-400 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <blockquote className="text-gray-600 italic text-lg">
                    <FaQuoteLeft className="text-blue-200 text-3xl inline-block mb-2" />
                    <p className="inline mx-2">{testimonial.quote}</p>
                    <FaQuoteRight className="text-blue-200 text-3xl inline-block" />
                  </blockquote>
                </div>
              </SwiperSlide>
            ))}
            <div className="swiper-pagination !bottom-0"></div>
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
