import { motion } from "framer-motion";
import { Heart, BookOpen, Leaf, Briefcase, Users, HandHeart } from "lucide-react";
import { useState } from "react";

const pillars = [
  {
    icon: Heart,
    title: "Health",
    description: "Advancing Sexual and Reproductive Health and Rights (SRHR) for young women living with HIV and those with disabilities.",
  },
  {
    icon: BookOpen,
    title: "Education",
    description: "Academic career mentorship and educational support for students, fostering confidence and decision-making skills.",
  },
  {
    icon: Leaf,
    title: "Environment",
    description: "Promoting sustainability through community engagement, biodiversity conservation, and sustainable resource management.",
  },
  {
    icon: Briefcase,
    title: "Livelihoods",
    description: "Empowering communities with vocational training, entrepreneurship support, and economic opportunities.",
  },
  {
    icon: Users,
    title: "Leadership & Governance",
    description: "Building leadership capacity through the Kiongozi Platform, empowering youth and women in governance.",
  },
  {
    icon: HandHeart,
    title: "Humanitarian",
    description: "Providing menstrual health education, STEM mentorship for vulnerable children, and mental health support.",
  },
];

const PillarCard = ({ pillar, index }: { pillar: typeof pillars[0]; index: number }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsFlipped(true);
  };

  const handleMouseLeave = () => {
    // Flip back after 3 seconds
    const id = setTimeout(() => {
      setIsFlipped(false);
    }, 3000);
    setTimeoutId(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative h-64 perspective-1000"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        className="relative w-full h-full transition-transform duration-700 preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front Side - Title and Icon */}
        <div
          className="absolute inset-0 bg-orange-50 dark:bg-orange-950/20 rounded-2xl p-8 shadow-lg border border-orange-200 dark:border-orange-800 backface-hidden flex flex-col items-center justify-center text-center"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-20 h-20 bg-orange-500 rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
            <pillar.icon className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-2xl font-heading font-bold text-gray-900 dark:text-white">
            {pillar.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">Hover to learn more</p>
        </div>

        {/* Back Side - Description */}
        <div
          className="absolute inset-0 bg-orange-500 rounded-2xl p-8 shadow-lg border border-orange-600 backface-hidden flex flex-col items-center justify-center text-center"
          style={{ 
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center mb-4">
            <pillar.icon className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-heading font-bold text-white mb-4">
            {pillar.title}
          </h3>
          <p className="text-white/90 text-sm leading-relaxed">
            {pillar.description}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

const PillarsSection = () => {
  return (
    <section id="pillars" className="py-24 bg-accent/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Our <span className="text-primary">Pillars</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Six key areas driving our sustainable development impact
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {pillars.map((pillar, i) => (
            <PillarCard key={pillar.title} pillar={pillar} index={i} />
          ))}
        </div>
      </div>

      {/* Add CSS for 3D transforms */}
      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}</style>
    </section>
  );
};

export default PillarsSection;
