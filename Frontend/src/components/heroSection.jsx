import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaWhatsapp, FaEnvelope, FaPhoneAlt } from 'react-icons/fa';

const SanSarif = styled.div`
  font-family: "Quicksand", sans-serif;
  font-optical-sizing: auto;
  font-weight: 600;
  font-style: normal;
`;

const ActionLineContainer = styled.div`
  position: absolute;
  bottom: 4rem; /* Adjust based on your needs */
  left: 0;
  transform: translateX(0);
  display: flex;
  align-items: center;
  z-index: 100;
  width: 80%; /* Make it responsive */
  max-width: 500px; /* Limit max width for larger screens */

  @media (min-width: 768px) {
    left: 50%;
    transform: translateX(-50%);
  }
`;

const Line = styled.div`
  height: 2px;
  width: 100%;
  background-color: #098487;
  position: relative;
  @media (max-width: 768px) {
    display: none;
  }
`;

const ActionIcon = styled.a`
  position: absolute;
  bottom: 50%;
  transform: translateY(50%);
  background-color: white;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.3s ease;

  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: #128C7E;
  }

  svg {
    color: #098487;
    width: 20px; /* Adjust icon size */
    height: 20px;
    transition: color 0.3s ease;

    &:hover {
      color: white;
    }
  }
`;

// Position icons along the line with responsiveness
const ActionIconWhatsapp = styled(ActionIcon)`
  left: calc(20% - 12.5px);
`;

const ActionIconEmail = styled(ActionIcon)`
  left: calc(50% - 12.5px);
`;

const ActionIconPhone = styled(ActionIcon)`
  left: calc(80% - 12.5px);
`;

const images = [
  {
    src: "https://cdn.pixabay.com/photo/2024/07/08/16/28/ai-generated-8881542_1280.jpg",
    alt: "Medical Consultation",
    text: "Expert Medical Consultation",
    subtitle: "Receive personalized medical care and expert advice tailored to your specific needs.",
    buttonText1: "Contact Us",
    buttonText2: "Learn More"
  },
  {
    src: "https://img.freepik.com/premium-photo/innovations-healthcare-catering-needs-adults-groups_1214173-42630.jpg?w=826",
    alt: "Advanced Technology",
    text: "State-of-the-Art Technology",
    subtitle: "Discover our advanced medical equipment designed to provide the highest level of care and precision.",
    buttonText1: "Our Technology",
    buttonText2: "Request a Demo"
  },
  {
    src: "https://img.freepik.com/free-photo/male-assistant-taking-notes-clipboard-while-female-doctor-is-talking-with-senior-woman-nursing-home_482257-20698.jpg?ga=GA1.2.1197899062.1726095420&semt=ais_hybrid",
    alt: "Caring Staff",
    text: "Compassionate Care",
    subtitle: "Meet our highly trained and compassionate staff dedicated to providing exceptional care and support for every patient.",
    buttonText1: "Meet the Team",
    buttonText2: "Get in Touch"
  }
];

function HeroSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef(null);

  const resetInterval = () => {
    if (timeoutRef.current) {
      clearInterval(timeoutRef.current);
    }
    timeoutRef.current = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);
  };

  useEffect(() => {
    resetInterval();
    return () => clearInterval(timeoutRef.current);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === 0 ? images.length - 1 : prevIndex - 1;
      resetInterval();
      return newIndex;
    });
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => {
      const newIndex = prevIndex === images.length - 1 ? 0 : prevIndex + 1;
      resetInterval();
      return newIndex;
    });
  };

  return (
    <SanSarif className="relative w-full h-[93vh] md:h-[100vh] overflow-hidden">
      <img
        src={images[currentIndex].src}
        className="absolute inset-0 w-full h-full object-cover"
        alt={images[currentIndex].alt}
      />
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: 'easeOut' }}
        className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 p-6 text-center"
      >
        <h1 className="text-white text-3xl md:text-4xl lg:text-5xl font-bold mb-2">
          {images[currentIndex].text}
        </h1>
        <p className="text-gray-300 text-base md:text-lg lg:text-xl mb-4 mx-4 md:mx-8 lg:mx-16">
          {images[currentIndex].subtitle}
        </p>
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mb-6">
          <button className="bg-gradient-to-r from-[#098487] to-[#00B4A1] text-white text-sm md:text-lg font-semibold border-2 border-transparent rounded-full px-6 md:px-8 py-2 md:py-3 shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-white hover:text-[#e9fcfc] hover:border-[#098487] hover:shadow-xl">
            {images[currentIndex].buttonText1}
          </button>
          <button className="hidden md:block bg-white text-[#098487] text-sm md:text-lg font-semibold border-2 border-[#098487] rounded-full px-6 md:px-8 py-2 md:py-3 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#098487] hover:text-white hover:shadow-xl">
            {images[currentIndex].buttonText2}
          </button>
        </div>
      </motion.div>

      <ActionLineContainer>
        <Line />
        <ActionIconWhatsapp href="https://wa.me/03091849279" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </ActionIconWhatsapp>
        <ActionIconEmail href="mailto:arhamsaif65@gmail.com">
          <FaEnvelope />
        </ActionIconEmail>
        <ActionIconPhone href="tel:+923091849279">
          <FaPhoneAlt />
        </ActionIconPhone>
      </ActionLineContainer>

      <div className="absolute bottom-12 w-full flex justify-end space-x-5 pr-5 md:mr-10 md:justify-between md:px-16">
        <button onClick={handlePrev} className="text-white text-lg md:text-xl lg:text-2xl shadow-md transition-transform transform hover:scale-105">
          <i className="fas fa-chevron-left"></i>
        </button>
        <button onClick={handleNext} className="text-white text-lg md:text-xl lg:text-2xl shadow-md transition-transform transform hover:scale-105">
          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </SanSarif>
  );
}

export default HeroSection;
