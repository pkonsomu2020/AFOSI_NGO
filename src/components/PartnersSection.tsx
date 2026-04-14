import { motion } from "framer-motion";
import { useState } from "react";

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

const LogoCard = ({ partner }: { partner: typeof partners[0] }) => {
  const [imgError, setImgError] = useState(false);
  return (
    <div className="flex-shrink-0 w-44 h-24 mx-4 bg-background rounded-xl flex items-center justify-center p-5 border border-border hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all duration-300 group">
      {!imgError ? (
        <img
          src={partner.logo}
          alt={partner.name}
          className="max-w-full max-h-full object-contain grayscale group-hover:grayscale-0 opacity-60 group-hover:opacity-100 transition-all duration-300"
          onError={() => setImgError(true)}
        />
      ) : (
        <span className="text-sm font-bold text-muted-foreground group-hover:text-primary transition-colors tracking-wide">
          {partner.name}
        </span>
      )}
    </div>
  );
};

const PartnersSection = () => {
  return (
    <section id="partners" className="py-24 bg-background overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-4">
            Trusted By
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            Our <span className="text-primary">Partners</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Organizations who have supported our work and enabled us to fulfill our mission
          </p>
        </motion.div>
      </div>

      {/* Infinite marquee — row 1 left */}
      <div className="relative mb-4">
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [0, -((partners.length * 192))] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners, ...partners].map((p, i) => (
              <LogoCard key={i} partner={p} />
            ))}
          </motion.div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>

      {/* Infinite marquee — row 2 right */}
      <div className="relative">
        <div className="flex overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: [-((partners.length * 192)), 0] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...partners, ...partners, ...partners].map((p, i) => (
              <LogoCard key={i} partner={p} />
            ))}
          </motion.div>
        </div>
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      </div>
    </section>
  );
};

export default PartnersSection;
