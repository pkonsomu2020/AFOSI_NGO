import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Target, Eye } from "lucide-react";

const AboutSection = () => {
  return (
    <section id="about" className="py-24 bg-background relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl" />
      
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Side - Creative Image Layout */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative px-8 sm:px-0"
          >
            {/* Main Image Container */}
            <div className="relative">
              {/* Decorative Shapes - Hidden on mobile, visible on tablet+ */}
              <div className="hidden sm:block absolute top-1/4 -right-8 sm:-right-12 w-16 sm:w-20 h-16 sm:h-20 bg-red-500 rounded-full z-10" />
              <div className="hidden sm:block absolute -bottom-8 left-1/4 w-0 h-0 border-l-[30px] sm:border-l-[40px] border-l-transparent border-r-[30px] sm:border-r-[40px] border-r-transparent border-b-[45px] sm:border-b-[60px] border-b-orange-500 z-10" />

              {/* Image 1 - Main Large Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative z-20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl transform rotate-1 sm:rotate-2"
              >
                <img
                  src="/afosi_pad2.jpg"
                  alt="AFOSI community work"
                  className="w-full h-[300px] sm:h-[400px] object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/afosi_pad.jpg";
                  }}
                />
                <div className="absolute inset-0 bg-black/20" />
              </motion.div>

              {/* Image 2 - Overlapping Smaller Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="absolute -bottom-8 sm:-bottom-12 -left-6 sm:-left-12 z-30 rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl border-2 sm:border-4 border-white dark:border-gray-900 transform -rotate-2 sm:-rotate-3 w-48 sm:w-64 h-36 sm:h-48"
              >
                <img
                  src="/afosi_pad1.jpg"
                  alt="AFOSI team"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/afosi_pad3.jpg";
                  }}
                />
              </motion.div>

              {/* Floating Badge */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="absolute -top-4 sm:-top-6 right-4 sm:right-8 z-30 bg-orange-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-xl"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs sm:text-sm">12+ Years</span>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Right Side - Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-12 lg:mt-0"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="inline-block mb-4"
            >
              <span className="px-4 py-2 bg-orange-100 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-full text-sm font-semibold">
                Who We Are
              </span>
            </motion.div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 sm:mb-6 leading-tight">
              About <span className="text-orange-500">AFOSI</span>
            </h2>
            
            <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-base sm:text-lg">
              Action For Sustainability Initiative (AFOSI) is a lean, technology-backed local NGO addressing challenges across health, education, livelihoods, leadership and governance, climate justice and humanitarian support.
            </p>
            <p className="text-muted-foreground mb-3 sm:mb-4 leading-relaxed text-sm sm:text-base">
              Our flagship initiatives—Sheria ya Vijana, M.A.T.H, Youth Voices Lab, and YOMA Projects—are implemented through our digital tools, including the Kiongozi Platform, Kenya Youth Climate Hub (KYCH), and Flare Hub startup management platform.
            </p>
            <p className="text-muted-foreground mb-6 sm:mb-8 leading-relaxed text-sm sm:text-base">
              We adopt a hybrid implementation model combining the community reach and trust of a grassroots NGO with the innovation and agility of social enterprises, creating sustainable impact across Kenya.
            </p>

            {/* Vision & Mission Cards */}
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 sm:p-5 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Our Vision</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">A Sustainable World!</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
                className="bg-orange-50 dark:bg-orange-950/20 rounded-xl p-4 sm:p-5 border border-orange-200 dark:border-orange-800"
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-heading font-semibold text-foreground mb-1 text-sm sm:text-base">Our Mission</h4>
                    <p className="text-xs sm:text-sm text-muted-foreground">To Promote Actions that are Geared Towards Harnessing and Protecting the Full Potential of Youth and Women.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <Button 
              className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-full px-6 sm:px-8 w-full sm:w-auto"
              size="lg"
              asChild
            >
              <a href="#contact">Support Our Mission</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
