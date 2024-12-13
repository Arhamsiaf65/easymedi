import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
const SanSarif = styled.div`
    font-family: "Quicksand", sans-serif;
    font-optical-sizing: auto;
    font-weight: 600;
    font-style: normal;
`;

function Footer() {
    const { ref, inView } = useInView({
        triggerOnce: false,
        threshold: 0.1,
      });
    return (
        <SanSarif className="w-full min-h-screen flex items-center justify-center bg-[#177D6B]">
            <motion.div 
            ref={ref}
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: inView ? 0 : 100, opacity: inView ? 1 : 0 }}
            transition={{ duration: 1.2, ease: 'easeOut' }}
            className="md:w-2/3 mt-10  w-full px-4 text-white flex flex-col">
                <div className="w-full text-6xl md:text-7xl font-bold">
                    <h1 className="w-full overflow-hidden md:w-2/3">
                        Need Medical Assistance? <br />
                        Get in Touch with Us
                    </h1>
                </div>
                <div className="flex mt-8 flex-col md:flex-row items-center gap-3 md:justify-between">
                    <p className="w-full md:w-2/3 text-gray-200">
                        Our medical professionals are here to assist you with any health concerns or questions you may have. For more information or to schedule a consultation, don't hesitate to reach out.
                    </p>
                    <div className="bg-white w-fit  text-[#098487] text-sm md:text-lg font-semibold border-2 border-[#098487] rounded-full px-6 md:px-8 py-2 md:py-3 shadow-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:bg-[#098487] hover:text-white hover:shadow-xl">
                        <a className="">Contact Us</a>
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex mt-24 mb-12 flex-row items-center justify-between">
                        <div>
                            <span className='text-3xl italic font-thin text-gray-300'>
                                Health <span className='text-xl font-bold text-white'>Care</span>
                            </span>
                        </div>
                        <a className="hidden md:block cursor-pointer text-gray-300 hover:text-white uppercase">About Us</a>
                        <a className="hidden md:block cursor-pointer text-gray-300 hover:text-white uppercase">Our Services</a>
                        <a className="hidden md:block cursor-pointer text-gray-300 hover:text-white uppercase">Why Choose Us</a>
                        <a className="hidden md:block cursor-pointer text-gray-300 hover:text-white uppercase">Contact</a>
                    </div>
                    <hr className="border-gray-200"/>
                    <p className="w-full text-center my-12 text-white">Copyright © 2024 Health-Care</p>
                </div>
            </motion.div>
        </SanSarif>
    );
}

export default Footer;
