import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

const stats = [
  { value: 350000, label: "Beneficiaries Reached", suffix: "+" },
  { value: 846, label: "Jobs Created", suffix: "+" },
  { value: 151, label: "Youth Enterprises Supported", suffix: "+" },
  { value: 5000, label: "Tons Plastic Waste Reduced", suffix: "+" },
];

const Counter = ({ target, suffix }: { target: number; suffix: string }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span ref={ref} className="text-4xl md:text-5xl font-heading font-bold text-primary-foreground">
      {count}{suffix}
    </span>
  );
};

const StatsSection = () => {
  return (
    <section className="py-20 bg-primary">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <Counter target={stat.value} suffix={stat.suffix} />
              <p className="text-primary-foreground/80 mt-2 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
