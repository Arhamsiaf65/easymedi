import React from 'react';
import { motion } from 'framer-motion';

const TextAnimator = ({ text, trigger }) => {
    const words = text.split(' ');

    return (
        <span>
            {words.map((word, index) => (
                <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: trigger ? 1 : 0}}
                    transition={{ delay: index * 0.09, duration: 0.2 }}
                    style={{ display: 'inline-block ', marginRight: '0.5rem' }} // Adjust the margin to control spacing
                >
                    {word}
                </motion.span>
            ))}
        </span>
    );
};

export default TextAnimator;
