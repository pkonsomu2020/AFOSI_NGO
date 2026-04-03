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
  { name: "Vanessa Wambui", role: "Data Specialist", image: "/vanessa-pic.jpeg" },
  { name: "Prisca Achieng", role: "Program Assistant", image: "/prisca.jpg" },
  { name: "Ivy Awuor", role: "Programs", image: "/ivy.jpg" },
  { name: "Elisha Papa", role: "IT Specialist", image: "/papa.jpg" },
  { name: "Virginia Kerubo", role: "Communications Lead", image: "/virginia.jpg" },
  { name: "Magdaline Watahi", role: "Programs", image: "/magda.jpg" },
  { name: "Elizabeth Muthoni", role: "Finance Officer", image: "/muthoni.jpg" },
];

const TeamCard = ({ member, delay }: { member: TeamMember; delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="group"
  >
    {/* Portrait image container */}
    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-4 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
      />
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>

    {/* Name & role below image */}
    <div>
      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
        {member.name}
      </h4>
      <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-1">
        {member.role}
      </p>
    </div>
  </motion.div>
);

const SectionLabel = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 mb-8"
  >
    <div className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 rounded-full border border-primary/20">
      <Icon size={18} className="text-primary" />
      <h3 className="text-base font-bold text-foreground uppercase tracking-wider">{label}</h3>
    </div>
    <div className="flex-1 h-px bg-border" />
  </motion.div>
);

const TeamSection = () => {
  return (
    <section id="team" className="relative py-20 overflow-hidden bg-background">
      <div className="container mx-auto px-4 max-w-7xl">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            Our Team
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-foreground leading-tight">
            Meet the People Behind{" "}
            <span className="text-primary">Our Mission</span>
          </h2>
          <p className="text-muted-foreground mt-3 max-w-xl text-sm sm:text-base">
            A passionate team of professionals dedicated to driving sustainable change and creating lasting impact in communities.
          </p>
        </motion.div>

        {/* Board Members */}
        <div className="mb-14">
          <SectionLabel icon={Award} label="Board Members" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {boardMembers.map((m, i) => (
              <TeamCard key={m.name} member={m} delay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* Management */}
        <div className="mb-14">
          <SectionLabel icon={Briefcase} label="Management Team" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {management.map((m, i) => (
              <TeamCard key={m.name} member={m} delay={i * 0.08} />
            ))}
          </div>
        </div>

        {/* Core Team */}
        <div className="mb-14">
          <SectionLabel icon={Users} label="Core Team" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {coreTeam.map((m, i) => (
              <TeamCard key={m.name} member={m} delay={i * 0.06} />
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center pt-4"
        >
          <p className="text-muted-foreground mb-4 text-sm">
            Want to join our mission? We're always looking for passionate individuals.
          </p>
          <a
            href="/opportunities"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-orange-600 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
          >
            <Users size={16} />
            View Opportunities
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default TeamSection;
