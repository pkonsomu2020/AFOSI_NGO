import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Clock, Share2, Facebook, Twitter, Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface BlogPostData {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  excerpt: string;
  content: {
    introduction: string;
    sections: {
      title: string;
      content: string;
      points?: string[];
    }[];
    conclusion: string;
  };
}

const blogPosts: Record<string, BlogPostData> = {
  "we-lead-program": {
    id: "we-lead-program",
    title: "We Lead Program",
    category: "Empowerment",
    date: "March 2024",
    readTime: "5 min read",
    image: "https://afosi.org/assets/images/we_lead.webp",
    excerpt: "The We Lead Project, funded by HIVOS East Africa through the Center for Adolescence (CSA), is designed to empower young women facing multiple barriers...",
    content: {
      introduction: "The We Lead Project, funded by HIVOS East Africa through the Center for Adolescence (CSA), is an inspiring initiative designed to empower young women facing multiple barriers in society. This project focuses on supporting young women right-holders on their SRHR (Sexual and Reproductive Health Rights).",
      sections: [
        {
          title: "Addressing Intersectionality",
          content: "By addressing the intersectionality of diverse challenges, the initiative provides a unique platform where young women can find support, share experiences, and develop vital leadership skills. The project recognizes that young women face multiple, overlapping barriers including:",
          points: [
            "Gender-based discrimination and violence",
            "Limited access to education and economic opportunities",
            "Cultural and social stigma around SRHR",
            "Lack of representation in decision-making spaces",
            "Economic marginalization and poverty"
          ]
        },
        {
          title: "Comprehensive Empowerment Approach",
          content: "Through mentorship, training, and access to essential resources, the project ensures that beneficiaries not only overcome personal obstacles but also emerge as remarkably influential voices in their communities. Our approach includes:",
          points: [
            "One-on-one mentorship with experienced leaders",
            "Leadership and advocacy training workshops",
            "SRHR education and awareness programs",
            "Safe spaces for sharing experiences and building solidarity",
            "Access to legal and health resources",
            "Skills development for economic empowerment"
          ]
        },
        {
          title: "Transformative Impact",
          content: "This comprehensive approach transforms lives by promoting self-confidence, fostering resilience, and equipping participants with the tools necessary to advocate for social justice and drive systemic change. Young women in the program develop:",
          points: [
            "Enhanced self-esteem and confidence",
            "Critical thinking and problem-solving skills",
            "Public speaking and advocacy abilities",
            "Understanding of their rights and how to claim them",
            "Networks of support and solidarity",
            "Capacity to mentor and support others"
          ]
        },
        {
          title: "Community Ripple Effect",
          content: "The impact of the We Lead Project extends beyond individual empowerment—it reshapes communities by creating a ripple effect of positive change. As these young women emerge as leaders, they inspire others in similar circumstances to challenge systemic barriers and work towards a more equitable society.",
        }
      ],
      conclusion: "The We Lead Project is more than an empowerment program—it's a movement for social justice and gender equality. By investing in young women's leadership, we're building a future where every woman has the power to shape her own destiny and contribute to transforming her community."
    }
  },
  "robotics-creative-coding": {
    id: "robotics-creative-coding",
    title: "Robotics and Creative Coding",
    category: "Education",
    date: "February 2024",
    readTime: "4 min read",
    image: "https://afosi.org/assets/images/robotics.webp",
    excerpt: "Health, Education, Environment, Livelihoods, and Leadership form the backbone of sustainable development...",
    content: {
      introduction: "Health, Education, Environment, Livelihoods, and Leadership & Governance form the backbone of sustainable development, and every community's progress hinges on these pillars. Our Robotics and Creative Coding program integrates these elements to create holistic community transformation.",
      sections: [
        {
          title: "The Five Pillars of Development",
          content: "Understanding the interconnected nature of community development is crucial to our approach:",
          points: [
            "Health: An asset that poor people cannot afford to lose, as their livelihoods depend on well-being, access to medical care, and a safe living environment",
            "Education: Empowers individuals and strengthens communities by opening up opportunities and eliminating extreme poverty",
            "Environment: Forests, rivers, and ecosystems underpin economic stability and community resilience",
            "Livelihoods: Ensure families have access to resources, sustainable employment, and improved quality of life",
            "Leadership & Governance: Creates accountability and enables communities to advocate for their rights"
          ]
        },
        {
          title: "STEM Education for Community Empowerment",
          content: "Our Robotics and Creative Coding program, in collaboration with STEM IMPACT CENTER, introduces youth to technology as a tool for solving real community challenges. Through hands-on learning, participants:",
          points: [
            "Develop critical thinking and problem-solving skills",
            "Learn to code and build robotic solutions",
            "Apply technology to address local challenges",
            "Gain confidence in STEM fields",
            "Prepare for future careers in technology",
            "Become innovators and change-makers in their communities"
          ]
        },
        {
          title: "Multi-Pronged Approach to Change",
          content: "AFOSI's approach to transformative change is comprehensive and community-centered. Through community empowerment, the organization raises grassroots socio-political consciousness with:",
          points: [
            "Training and skill enhancement programs",
            "Building solidarity and collective action",
            "Helping individuals overcome psychological barriers",
            "Catalyzing proactive change from within communities",
            "Creating sustainable pathways out of poverty",
            "Fostering innovation and entrepreneurship"
          ]
        },
        {
          title: "Technology as an Equalizer",
          content: "By introducing robotics and coding in informal settlements, we're breaking down barriers to technology access and creating new opportunities for youth who might otherwise be excluded from the digital economy. This program demonstrates that innovation can thrive anywhere when given the right support and resources."
        }
      ],
      conclusion: "The Robotics and Creative Coding program is transforming how young people in informal settlements see themselves and their futures. By combining STEM education with community development principles, we're not just teaching coding—we're building the next generation of innovators, problem-solvers, and community leaders."
    }
  },
  "westo-recyclers": {
    id: "westo-recyclers",
    title: "Westo Recyclers",
    category: "Environment",
    date: "January 2024",
    readTime: "6 min read",
    image: "https://afosi.org/assets/images/westo.webp",
    excerpt: "An innovative eco-entrepreneurship initiative transforming everyday waste into valuable resources in Nairobi's informal settlements...",
    content: {
      introduction: "Westo Recyclers is an innovative eco-entrepreneurship initiative launched by AFOSI in Nairobi's informal settlements. By transforming everyday waste into valuable resources, the program creates new income opportunities for local residents while promoting environmental sustainability.",
      sections: [
        {
          title: "The Waste Challenge in Informal Settlements",
          content: "Nairobi's informal settlements face significant waste management challenges. With limited municipal services and growing populations, plastic waste accumulates in streets, drainage systems, and open spaces, creating:",
          points: [
            "Health hazards from contaminated environments",
            "Blocked drainage leading to flooding",
            "Environmental pollution affecting air and water quality",
            "Loss of aesthetic value in communities",
            "Breeding grounds for disease vectors",
            "Missed economic opportunities from recyclable materials"
          ]
        },
        {
          title: "Turning Waste into Wealth",
          content: "Westo Recyclers transforms this challenge into an opportunity by establishing a community-based recycling system that:",
          points: [
            "Collects plastic waste from households and businesses",
            "Sorts and processes materials for recycling",
            "Creates employment for local residents",
            "Generates income from selling recycled materials",
            "Reduces environmental pollution",
            "Educates the community on waste management"
          ]
        },
        {
          title: "Community Education and Engagement",
          content: "Through hands-on recycling efforts and community education, Westo Recyclers not only helps reduce environmental waste but also instills a sense of pride and empowerment among residents. Our education programs include:",
          points: [
            "Door-to-door awareness campaigns on waste separation",
            "School programs teaching children about recycling",
            "Community clean-up events and competitions",
            "Training on sustainable waste management practices",
            "Workshops on creating products from recycled materials",
            "Advocacy for better municipal waste services"
          ]
        },
        {
          title: "Economic Empowerment Through Green Jobs",
          content: "Westo Recyclers creates sustainable livelihoods by employing community members as waste collectors, sorters, and processors. This provides:",
          points: [
            "Regular income for participating households",
            "Skills training in waste management and entrepreneurship",
            "Opportunities for women and youth",
            "Dignity through meaningful work",
            "Pathways to environmental entrepreneurship",
            "Community ownership of environmental solutions"
          ]
        },
        {
          title: "Scaling Impact",
          content: "This initiative is a testament to how small-scale actions can drive meaningful change in urban communities. By demonstrating the viability of community-based recycling, Westo Recyclers serves as a model that can be replicated in other informal settlements across Nairobi and beyond."
        }
      ],
      conclusion: "Westo Recyclers proves that environmental sustainability and economic empowerment can go hand in hand. By engaging communities as active participants in waste management, we're not just cleaning up neighborhoods—we're creating green jobs, fostering environmental stewardship, and building more resilient communities."
    }
  },
  "kiongozi-platform": {
    id: "kiongozi-platform",
    title: "Kiongozi Platform",
    category: "Leadership",
    date: "December 2023",
    readTime: "5 min read",
    image: "https://afosi.org/assets/images/kiongozi.webp",
    excerpt: "An emerging leaders platform providing mentorship, capacity-building, and leadership training for grassroots youth, women, and persons with disabilities...",
    content: {
      introduction: "Kiongozi platform (www.kiongozi.ke) is an Emerging Leaders Platform that serves as a springboard for grassroots youth, women, and persons living with disabilities. Focused on nurturing untapped potential, Kiongozi provides leadership training, mentorship, and networking opportunities designed to empower individuals from marginalized communities.",
      sections: [
        {
          title: "Bridging the Leadership Gap",
          content: "Many talented individuals in marginalized communities lack access to leadership development opportunities. Kiongozi addresses this gap by providing:",
          points: [
            "Accessible online and offline training programs",
            "Mentorship from experienced leaders across sectors",
            "Networking opportunities with peers and professionals",
            "Resources and tools for leadership development",
            "Safe spaces for learning and growth",
            "Recognition and visibility for emerging leaders"
          ]
        },
        {
          title: "Tailored Programs for Diverse Needs",
          content: "By offering tailored programs that build essential skills and confidence, the platform encourages participants to take on leadership roles and drive meaningful change within their local environments. Our programs include:",
          points: [
            "Leadership fundamentals and personal development",
            "Community organizing and advocacy skills",
            "Project management and resource mobilization",
            "Communication and public speaking",
            "Digital literacy and online presence",
            "Inclusive leadership and disability rights",
            "Gender equality and women's empowerment"
          ]
        },
        {
          title: "Mentorship and Peer Learning",
          content: "Kiongozi connects emerging leaders with experienced mentors who provide guidance, support, and inspiration. Our mentorship model includes:",
          points: [
            "One-on-one mentoring relationships",
            "Group mentoring sessions and peer circles",
            "Industry-specific guidance and career advice",
            "Regular check-ins and progress tracking",
            "Access to mentor networks and opportunities",
            "Long-term support beyond program completion"
          ]
        },
        {
          title: "Community Transformation",
          content: "Beyond individual growth, Kiongozi fosters community transformation by connecting emerging leaders with real-world challenges and resources. Participants:",
          points: [
            "Lead community projects addressing local needs",
            "Advocate for policy changes and social justice",
            "Mentor and inspire others in their communities",
            "Create employment and economic opportunities",
            "Build coalitions for collective action",
            "Amplify marginalized voices in decision-making spaces"
          ]
        },
        {
          title: "Digital Platform for Scale",
          content: "The Kiongozi digital platform (www.kiongozi.ke) extends our reach beyond physical boundaries, enabling leaders from across Kenya to access training, connect with mentors, and collaborate on initiatives. The platform features:",
          points: [
            "Online courses and learning resources",
            "Virtual mentorship and networking",
            "Community forums and discussion groups",
            "Job and opportunity boards",
            "Success stories and inspiration",
            "Tools for project planning and collaboration"
          ]
        }
      ],
      conclusion: "Kiongozi is more than a leadership platform—it's a movement to democratize leadership development and ensure that talent, not privilege, determines who gets to lead. By investing in emerging leaders from marginalized communities, we're building a more inclusive, equitable, and dynamic society where everyone has the opportunity to reach their full potential and contribute to positive change."
    }
  }
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading font-bold text-foreground mb-4">Post Not Found</h1>
          <Link to="/#blog">
            <Button variant="hero">Back to Blog</Button>
          </Link>
        </div>
      </div>
    );
  }

  const shareUrl = window.location.href;
  const shareText = `Check out this article: ${post.title}`;

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-[50vh] sm:h-[60vh] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 sm:px-6 pb-12 sm:pb-16">
            <Link to="/#blog" className="inline-flex items-center gap-2 text-white/80 hover:text-white transition-colors mb-6 group">
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-semibold">Back to Blog</span>
            </Link>
            
            <Badge className="bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 mb-4">
              {post.category}
            </Badge>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-white mb-4 leading-tight">
              {post.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-white/90 text-sm">
              <div className="flex items-center gap-2">
                <Calendar size={16} />
                <span>{post.date}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-2">
                <Clock size={16} />
                <span>{post.readTime}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            {/* Share buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-8 pb-8 border-b border-border"
            >
              <span className="text-sm font-semibold text-muted-foreground">Share:</span>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
              >
                <Facebook size={16} />
                Facebook
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}
              >
                <Twitter size={16} />
                Twitter
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
              >
                <Linkedin size={16} />
                LinkedIn
              </Button>
            </motion.div>

            {/* Introduction */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="prose prose-lg max-w-none mb-12"
            >
              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.content.introduction}
              </p>
            </motion.div>

            {/* Sections */}
            {post.content.sections.map((section, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="mb-12"
              >
                <h2 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                  {section.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  {section.content}
                </p>
                {section.points && (
                  <ul className="space-y-3 ml-6">
                    {section.points.map((point, idx) => (
                      <li key={idx} className="text-muted-foreground leading-relaxed flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}

            {/* Conclusion */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-primary/5 rounded-2xl p-6 sm:p-8 border border-primary/20 mb-12"
            >
              <h2 className="text-2xl font-heading font-bold text-foreground mb-4">Conclusion</h2>
              <p className="text-muted-foreground leading-relaxed">
                {post.content.conclusion}
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-center bg-primary/10 rounded-2xl p-8 sm:p-12 border border-primary/20"
            >
              <h3 className="text-2xl sm:text-3xl font-heading font-bold text-foreground mb-4">
                Want to Get Involved?
              </h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Join us in creating sustainable change. Whether through volunteering, partnerships, or donations, your support makes a difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild>
                  <a href="/#contact">Contact Us</a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/#blog">Read More Stories</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogPost;
