import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { Users, Award, Briefcase, ChevronDown, Monitor, BarChart2, DollarSign, Layers } from "lucide-react";

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
    name: "IT & Communication",
    icon: Monitor,
    members: [
      { name: "Elisha Papa", role: "IT Specialist", image: "/TEAMS/papa.jpg" },
      { name: "Virginia Kerubo", role: "Communications Lead", image: "/TEAMS/virginia.jpg" },
      { name: "Joe Liban", role: "IT & Communication", image: "/placeholder.svg" },
      { name: "Peter Onsomu", role: "IT & Communication", image: "/placeholder.svg" },
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
    name: "Finance Department",
    icon: DollarSign,
    members: [
      { name: "Elizabeth Muthoni", role: "Finance Officer", image: "/TEAMS/muthoni.jpg" },
      { name: "Titus", role: "Finance", image: "/placeholder.svg" },
    ],
  },
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
];

// Portrait card — same design as board/management
const TeamCard = ({ member }: { member: TeamMember }) => (
  <div className="group flex-shrink-0 w-44">
    <div className="relative rounded-2xl overflow-hidden aspect-[3/4] mb-3 shadow-md">
      <img
        src={member.image}
        alt={member.name}
        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
        onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-orange-600/80 via-orange-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </div>
    <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
      {member.name}
    </h4>
    <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
      {member.role}
    </p>
  </div>
);

// Auto-scrolling carousel for departments with many members
const AutoCarousel = ({ members }: { members: TeamMember[] }) => {
  const [index, setIndex] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % members.length);
    }, 3500);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [members.length]);

  return (
    <div className="relative overflow-hidden">
      <div
        className="flex gap-5 transition-transform duration-1000 ease-in-out"
        style={{ transform: `translateX(-${index * 196}px)` }}
      >
        {/* Triple the array for seamless loop feel */}
        {[...members, ...members, ...members].map((m, i) => (
          <TeamCard key={`${m.name}-${i}`} member={m} />
        ))}
      </div>
      {/* Fade edges */}
      <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none z-10" />
      <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none z-10" />
      {/* Dots */}
      <div className="flex gap-1.5 justify-center mt-4">
        {members.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === index % members.length ? "bg-primary w-4" : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

// Department accordion item
const DepartmentAccordion = ({ dept, defaultOpen = false }: { dept: typeof departments[0]; defaultOpen?: boolean }) => {
  const [open, setOpen] = useState(defaultOpen);
  const Icon = dept.icon;
  const isLarge = dept.members.length > 3;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="border border-border rounded-2xl overflow-hidden"
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-card hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center">
            <Icon size={18} className="text-primary" />
          </div>
          <span className="font-bold text-foreground">{dept.name}</span>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {dept.members.length} members
          </span>
        </div>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.3 }}>
          <ChevronDown size={20} className="text-muted-foreground" />
        </motion.div>
      </button>

      {/* Accordion content */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 py-6 bg-background">
              {isLarge ? (
                <AutoCarousel members={dept.members} />
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
                  {dept.members.map((m) => (
                    <TeamCard key={m.name} member={m} />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

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

const StaticGrid = ({ members }: { members: TeamMember[] }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
    {members.map((m, i) => (
      <motion.div
        key={m.name}
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: i * 0.08 }}
      >
        <TeamCard member={m} />
      </motion.div>
    ))}
  </div>
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
          <StaticGrid members={boardMembers} />
        </div>

        {/* Management */}
        <div className="mb-14">
          <SectionLabel icon={Briefcase} label="Management Team" />
          <StaticGrid members={management} />
        </div>

        {/* Core Team — Department Dropdowns */}
        <div className="mb-14">
          <SectionLabel icon={Users} label="Core Team" />
          <div className="space-y-3">
            {departments.map((dept, i) => (
              <DepartmentAccordion key={dept.name} dept={dept} defaultOpen={i === 0} />
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
