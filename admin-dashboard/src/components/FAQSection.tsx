import React from 'react';

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: 'Q1: Is the app safe for crypto trading?',
      answer:
        'Yes, we use secure APIs and encryption to protect all your transactions.',
    },
    {
      question: 'Q2: What networks are supported for airtime/data?',
      answer:
        'MTN, Glo, Airtel, 9mobile — all major Nigerian networks are covered.',
    },
    {
      question: 'Q3: Can I send money to other users?',
      answer: 'Yes, you can transfer both naira and crypto within the app.',
    },
    {
      question: 'Q4: Where can I download the app?',
      answer:
        'The app will be available on the Google Play Store and Apple App Store soon.',
    },
    {
      question: 'Q5: How do I create an account?',
      answer:
        "Click on the 'Sign Up' button and follow the instructions to verify your email, set up two-factor authentication (2FA), and complete identity verification (KYC) if required.",
    },
    {
      question: 'Q6: What should I do if I forget my password?',
      answer:
        "Click 'Forgot Password' on the login page and follow the steps to reset your password via your registered email.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="max-w-4xl mx-auto">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 mb-4 shadow-md"
              data-aos="fade-up"
              data-aos-delay={index * 100}
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                {faq.question}
              </h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
