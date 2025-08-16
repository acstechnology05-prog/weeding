import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { Heart, Users, Calendar, Star } from 'lucide-react';

const StatsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const stats = [
    {
      icon: Heart,
      number: 1200,
      suffix: '+',
      label: 'Successful Matches',
      color: 'text-primary',
    },
    {
      icon: Calendar,
      number: 350,
      suffix: '+',
      label: 'Weddings This Year',
      color: 'text-secondary',
    },
    {
      icon: Users,
      number: 50000,
      suffix: '+',
      label: 'Happy Families',
      color: 'text-primary',
    },
    {
      icon: Star,
      number: 98,
      suffix: '%',
      label: 'Success Rate',
      color: 'text-secondary',
    },
  ];

  const AnimatedNumber = ({ number, suffix, isInView }: { number: number; suffix: string; isInView: boolean }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (isInView) {
        const timer = setInterval(() => {
          setCount((prev) => {
            const increment = number > 1000 ? Math.ceil(number / 100) : Math.ceil(number / 50);
            if (prev + increment >= number) {
              clearInterval(timer);
              return number;
            }
            return prev + increment;
          });
        }, 30);

        return () => clearInterval(timer);
      }
    }, [isInView, number]);

    return (
      <span>
        {count.toLocaleString()}{suffix}
      </span>
    );
  };

  return (
    <section className="py-20 bg-gradient-to-r from-accent/10 via-white to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-gray-800 mb-4">
            Celebrating Love Stories
          </h2>
          <p className="font-poppins text-xl text-gray-600 max-w-2xl mx-auto">
            Join thousands of couples who found their perfect match through our platform
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className="text-center group"
            >
              <motion.div
                whileHover={{ scale: 1.1, rotate: 5 }}
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 mb-4 group-hover:shadow-lg transition-all`}
              >
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </motion.div>
              
              <motion.div
                className={`font-playfair text-4xl sm:text-5xl font-bold ${stat.color} mb-2`}
              >
                <AnimatedNumber number={stat.number} suffix={stat.suffix} isInView={isInView} />
              </motion.div>
              
              <p className="font-poppins text-gray-600 font-medium">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;