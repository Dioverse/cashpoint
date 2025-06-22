import React from 'react';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

// Import gallery images
import cash_p_img_3 from '../assets/images/cash_P_IMG_3.jpg';
import cash_p_img_5 from '../assets/images/cash_P_img_5.jpg';
import cash_p_img_6 from '../assets/images/cash_P_IMG_6.jpg';
import cashpoint_img_2 from '../assets/images/cashpoint_img_2.png';
import gallery_5 from '../assets/images/gallery/gallery-5.jpg';
import sample from '../assets/images/sample.jpg';
import gallery_7 from '../assets/images/gallery/gallery-7.jpg';
import gallery_8 from '../assets/images/gallery/gallery-8.jpg';

const images = [
  { src: cash_p_img_3 },
  { src: cash_p_img_5 },
  { src: cash_p_img_6 },
  { src: cashpoint_img_2 },
  { src: gallery_5 },
  { src: sample },
  { src: gallery_7 },
  { src: gallery_8 },
];

const GallerySection: React.FC = () => {
  const [open, setOpen] = React.useState(false);
  const [index, setIndex] = React.useState(0);

  const toggleLightbox = (imageIndex: number) => {
    setIndex(imageIndex);
    setOpen(!open);
  };

  return (
    <section id="gallery" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16" data-aos="fade-up">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Gallery</h2>
          <p className="text-gray-600">Explore our platform and services</p>
        </div>

        <div
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          {images.map((image, idx) => (
            <div
              key={idx}
              className="group relative cursor-pointer overflow-hidden rounded-lg shadow-lg"
              onClick={() => toggleLightbox(idx)}
            >
              <img
                src={image.src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-opacity duration-300"></div>
            </div>
          ))}
        </div>
      </div>

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={images}
        index={index}
      />
    </section>
  );
};

export default GallerySection;
