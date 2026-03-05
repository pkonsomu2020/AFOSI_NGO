import { motion } from "framer-motion";

const partners = [
  { name: "We Lead", logo: "/we_lead_logo.png" },
  { name: "Udada Imara", logo: "/udada_imara_logo.png" },
  { name: "SYO", logo: "/syo_logo.png" },
  { name: "RAI", logo: "/rai_logo.jpg" },
  { name: "PYWV", logo: "/pywv_logo.jpg" },
  { name: "NYECBO", logo: "/nyecbo_logo.jpg" },
  { name: "Inuka", logo: "/inuka_logo.jpg" },
  { name: "GEM Trust", logo: "/gem_logo.png" },
  { name: "Dayo", logo: "/dayo_logo.jpg" },
  { name: "CSA", logo: "/csa_logo.png" },
];

const PartnersSection = () => {
  return (
    <section id="partners" className="py-24 bg-accent/30 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Partners who have supported our work and enabled us to fulfill our mission
          </p>
        </motion.div>

        {/* Scrolling carousel */}
        <div className="relative">
          <div className="flex overflow-hidden">
            <motion.div
              className="flex gap-8"
              animate={{
                x: [0, -1920],
              }}
              transition={{
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                },
              }}
            >
              {/* First set */}
              {partners.map((partner, i) => (
                <div
                  key={`${partner.name}-1-${i}`}
                  className="flex-shrink-0 w-48 h-32 bg-background rounded-2xl shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center p-6 border border-border"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {partners.map((partner, i) => (
                <div
                  key={`${partner.name}-2-${i}`}
                  className="flex-shrink-0 w-48 h-32 bg-background rounded-2xl shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center p-6 border border-border"
                >
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* Edge overlays */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-background/80 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-background/80 pointer-events-none" />
        </div>

        {/* Static grid for mobile */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-12 lg:hidden">
          {partners.map((partner, i) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-background rounded-2xl shadow-sm hover:shadow-lg transition-shadow flex items-center justify-center p-6 border border-border aspect-square"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className="max-w-full max-h-full object-contain"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PartnersSection;
