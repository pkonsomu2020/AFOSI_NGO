import { motion } from "framer-motion";
import { Users, Award, Briefcase } from "lucide-react";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const boardMembers: TeamMember[] = [
  { name: "Eva Nchogu", role: "Board Chairperson", image: "/eva.jpg" },
  { name: "Winnie Osoro", role: "Board Treasurer", image: "/winnie.jpg" },
  { name: "Lucy Mogesi", role: "Board Member", image: "/lucy.jpg" },
  { name: "Anne Nderitu", role: "Board Member", image: "/anne.jpg" },
];

const management: TeamMember[] = [
  { name: "Eric Nyamwaro", role: "Executive Director", image: "/eric.jpg" },
  { name: "Esther Mwikali", role: "National Coordinator", image: "/esther.jpg" },
];

const coreTeam: TeamMember[] = [
  { name: "Fredrick Ongaki", role: "MEAL Specialist", image: "/ongaki.jpg" },
  { name: "Davin Omollo", role: "Project Associate", image: "/davin.jpg" },
  { name: "Vanessa Wambui", role: "Data Specialist", image: "/vanessa.jpg" },
  { name: "Prisca Achieng", role: "Program Assistant", image: "/prisca.jpg" },
  { name: "Ivy Awuor", role: "Programs", image: "/ivy.jpg" },
  { name: "Elisha Papa", role: "IT Specialist", image: "/papa.jpg" },
  { name: "Virginia Kerubo", role: "Communications Lead", image: "/virginia.jpg" },
  { name: "Magdaline Watahi", role: "Programs", image: "/magda.jpg" },
  { name: "Elizabeth Muthoni", role: "Finance Officer", image: "/muthoni.jpg" },
];

const TeamMemberCard = ({ member, delay, featured = false }: { member: TeamMember; delay: number; featured?: boolean }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group relative"
  >
    <div className={`relative bg-card rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-border/50 h-full ${
      featured ? 'lg:scale-105' : ''
    }`}>
      {/* Simple hover overlay */}
      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="relative p-6 sm:p-8">
        {/* Image container with rectangle styling */}
        <div className="relative mb-6">
          <div className="relative w-full aspect-[4/5] max-w-[200px] mx-auto">
            {/* Image with rectangle shape */}
            <div className="relative w-full h-full rounded-xl overflow-hidden border-4 border-background shadow-xl group-hover:scale-105 transition-transform duration-500">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-full object-cover object-[center_20%]"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                }}
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-center space-y-2">
          <h4 className="text-lg sm:text-xl font-heading font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {member.name}
          </h4>
          <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 bg-primary/10 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            <p className="text-xs sm:text-sm text-primary font-semibold uppercase tracking-wide">
              {member.role}
            </p>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </div>
  </motion.div>
);

const TeamSection = () => {
  return (
    <section id="team" className="relative py-20 sm:py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-background" />
      
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 sm:mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Users size={20} className="text-primary" />
            <span className="text-sm font-semibold text-primary uppercase tracking-wider">Our Team</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-heading font-bold text-foreground mb-4 sm:mb-6">
            Meet the People Behind{" "}
            <span className="text-primary">
              Our Mission
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            A passionate team of professionals dedicated to driving sustainable change and creating lasting impact in communities
          </p>
        </motion.div>

        {/* Board Members */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-10 sm:mb-12"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <Award size={24} className="text-primary" />
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                Board Members
              </h3>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {boardMembers.map((member, i) => (
              <TeamMemberCard key={member.name} member={member} delay={i * 0.1} featured={i === 0} />
            ))}
          </div>
        </div>

        {/* Management */}
        <div className="mb-16 sm:mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-10 sm:mb-12"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <Briefcase size={24} className="text-primary" />
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                Management Team
              </h3>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {management.map((member, i) => (
              <TeamMemberCard key={member.name} member={member} delay={i * 0.1} featured />
            ))}
          </div>
        </div>

        {/* Core Team */}
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-center gap-3 mb-10 sm:mb-12"
          >
            <div className="flex items-center gap-3 px-6 py-3 bg-primary/10 rounded-full border border-primary/20">
              <Users size={24} className="text-primary" />
              <h3 className="text-xl sm:text-2xl font-heading font-bold text-foreground">
                Core Team
              </h3>
            </div>
          </motion.div>
          <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {coreTeam.map((member, i) => (
              <TeamMemberCard key={member.name} member={member} delay={i * 0.1} />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 sm:mt-20 text-center"
        >
          <div className="inline-flex flex-col items-center gap-4 px-8 py-6 bg-primary/5 rounded-2xl border border-border/50">
            <p className="text-base sm:text-lg text-muted-foreground max-w-xl">
              Want to join our mission? We're always looking for passionate individuals to make a difference.
            </p>
            <a 
              href="/opportunities" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-semibold hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <Users size={18} />
              View Opportunities
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
