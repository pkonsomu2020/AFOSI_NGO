import { useState } from "react";
import { motion } from "framer-motion";
import { Users, Award, Briefcase, Monitor, BarChart2, DollarSign, Layers } from "lucide-react";
import Navbar from "@/components/Navbar";
import ScrollToTop from "@/components/ScrollToTop";

interface TeamMember {
  name: string;
  role: string;
  image: string;
}

const boardMembers: TeamMember[] = [
  { name: "Eva Nchogu", role: "Board Chairperson", image: "/TEAMS/eva.jpg" },
  { name: "Winnie Osoro", role: "Board Treasurer", image: "/TEAMS/winnie.jpg" },
  { name: "Lucy Mogesi", role: "Board Member", image: "/TEAMS/Lucy Mogesi.jpeg" },
  { name: "Anne Nderitu", role: "Board Member", image: "/TEAMS/anne.jpg" },
];

const management: TeamMember[] = [
  { name: "Eric Nyamwaro", role: "Executive Director", image: "/TEAMS/eric.jpg" },
  { name: "Esther Mwikali", role: "National Coordinator", image: "/TEAMS/esther.jpg" },
];

const departments = [
  {
    name: "Programs Department",
    icon: Layers,
    members: [
      { name: "Prisca Achieng", role: "Program Assistant", image: "/TEAMS/prisca.jpg" },
      { name: "Davin Omollo", role: "Project Associate", image: "/TEAMS/davin.jpg" },
      { name: "Ivy Awuor", role: "Programs", image: "/TEAMS/ivy.jpg" },
      { name: "Felix Omondi", role: "Programs", image: "/TEAMS/FELIX OMONDI.png" },
      { name: "Magdaline Watahi", role: "Programs", image: "/TEAMS/magda.jpg" },
      { name: "Barbra Wanjiku", role: "Programs", image: "/TEAMS/Barbra Wanjiru.jpeg" },
    ],
  },
  {
    name: "MEAL Department",
    icon: BarChart2,
    members: [
      { name: "Vanessa Wambui", role: "Data Specialist", image: "/TEAMS/vanessa-pic.jpeg" },
      { name: "Fredrick Ongaki", role: "MEAL Specialist", image: "/TEAMS/ongaki.jpg" },
    ],
  },
  {
    name: "IT & Communication",
    icon: Monitor,
    members: [
      { name: "Elisha Papa", role: "IT Specialist", image: "/TEAMS/papa.jpg" },
      { name: "Virginia Kerubo", role: "Communications Lead", image: "/TEAMS/virginia.jpg" },
      { name: "Joe Liban", role: "IT & Communication", image: "/placeholder.svg" },
      { name: "Peter Onsomu", role: "IT & Communication", image: "/TEAMS/Peter Onsomu.jpg" },
    ],
  },
  {
    name: "Finance Department",
    icon: DollarSign,
    members: [
      { name: "Elizabeth Muthoni", role: "Finance Officer", image: "/TEAMS/muthoni.jpg" },
      { name: "Titus", role: "Finance", image: "/titus.jpeg" },
    ],
  },
];

const MemberCard = ({ member, delay = 0 }: { member: TeamMember; delay?: number }) => {
  const [imgError, setImgError] = useState(false);
  const initials = member.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      className="group"
    >
      {/* Portrait card */}
      <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-3 shadow-sm bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/10 border border-border/50">
        {!imgError ? (
          <img
            src={member.image}
            alt={member.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-5xl font-black text-orange-400/40">{initials}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-600/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
      </div>
      {/* Name & role */}
      <h4 className="text-sm font-bold text-foreground leading-tight">{member.name}</h4>
      <p className="text-xs text-primary font-semibold uppercase tracking-wider mt-0.5">{member.role}</p>
    </motion.div>
  );
};

const SectionHeading = ({ icon: Icon, label }: { icon: any; label: string }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="flex items-center gap-3 mb-8"
  >
    <div className="flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full border border-primary/20">
      <Icon size={15} className="text-primary" />
      <span className="text-xs font-bold text-foreground uppercase tracking-widest">{label}</span>
    </div>
    <div className="flex-1 h-px bg-border" />
  </motion.div>
);

const Team = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <ScrollToTop />

      <div className="container mx-auto px-6 sm:px-8 max-w-7xl pt-32 pb-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase mb-3">
            Our People
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-foreground leading-tight">
            Meet the Team Behind <span className="text-primary">AFOSI</span>
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-base">
            A passionate group of professionals dedicated to creating sustainable impact across Kenya.
          </p>
        </motion.div>

        {/* Board Members */}
        <div className="mb-16">
          <SectionHeading icon={Award} label="Board Members" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {boardMembers.map((m, i) => <MemberCard key={m.name} member={m} delay={i * 0.07} />)}
          </div>
        </div>

        {/* Management */}
        <div className="mb-16">
          <SectionHeading icon={Briefcase} label="Management Team" />
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {management.map((m, i) => <MemberCard key={m.name} member={m} delay={i * 0.07} />)}
          </div>
        </div>

        {/* Core Team — flat grid per department, no dropdown */}
        <div>
          <SectionHeading icon={Users} label="Core Team" />
          <div className="space-y-14">
            {departments.map((dept) => {
              const Icon = dept.icon;
              return (
                <div key={dept.name}>
                  {/* Department sub-label */}
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Icon size={14} className="text-primary" />
                    </div>
                    <span className="text-sm font-bold text-foreground">{dept.name}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {dept.members.length} members
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5">
                    {dept.members.map((m, i) => <MemberCard key={m.name} member={m} delay={i * 0.06} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Team;
