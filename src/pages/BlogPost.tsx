import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Clock, Facebook, Twitter, Linkedin, Heart, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

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

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("on");
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    
    setTimeout(() => {
      document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
      const heroBg = document.getElementById("blogHeroBg");
      if (heroBg) heroBg.classList.add("loaded");
    }, 100);

    return () => obs.disconnect();
  }, [post]);

  const shareUrl = window.location.href;
  const shareText = `Check out this article: ${post.title}`;

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <ScrollToTop />
      <Navbar />

      {/* ── FULL-BLEED HERO ── */}
      <header className="detail-hero">
        <div 
          className="detail-hero-bg" 
          id="blogHeroBg" 
          style={{ backgroundImage: `url('${post.image}')` }} 
          role="img" 
        />
        <div className="detail-hero-overlay"></div>

        {/* Breadcrumb */}
        <div className="detail-breadcrumb">
          <Link to="/#blog">
            <ArrowLeft size={14} style={{ display: 'inline', marginRight: '8px' }} />
            Back to Blog
          </Link>
        </div>

        {/* Hero content */}
        <div className="detail-hero-content">
          <div className="detail-eyebrow">{post.category}</div>
          <h1 className="detail-hero-title">{post.title}</h1>
          
          <div className="detail-hero-stats">
            <div className="detail-stat-badge">
              <Calendar size={14} style={{ color: 'var(--or)' }} />
              {post.date}
            </div>
            <div className="detail-stat-badge">
              <Clock size={14} style={{ color: 'var(--or)' }} />
              {post.readTime}
            </div>
          </div>
        </div>
      </header>

      {/* ── INTRO + STICKY SIDEBAR ── */}
      <div className="detail-body">
        {/* LEFT: Main content */}
        <main className="detail-main">
          
          {/* Share buttons */}
          <div className="reveal flex flex-wrap items-center gap-4 mb-12 pb-8" style={{ borderBottom: '1px solid var(--border)' }}>
            <span style={{ fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--silver)' }}>Share:</span>
            <button
              className="btn-ghost"
              style={{ padding: '10px 20px', fontSize: '10px' }}
              onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
              <Facebook size={14} /> Facebook
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '10px 20px', fontSize: '10px' }}
              onClick={() => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`, '_blank')}
            >
              <Twitter size={14} /> Twitter
            </button>
            <button
              className="btn-ghost"
              style={{ padding: '10px 20px', fontSize: '10px' }}
              onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`, '_blank')}
            >
              <Linkedin size={14} /> LinkedIn
            </button>
          </div>

          {/* Introduction */}
          <div className="reveal">
            <p className="detail-body-text" style={{ fontSize: '18px', color: 'var(--fg)' }}>
              {post.content.introduction}
            </p>
          </div>

          {/* Sections */}
          {post.content.sections.map((section, index) => (
            <div key={index} className="reveal" style={{ marginTop: '48px' }}>
              <h2 className="detail-section-title" style={{ fontSize: 'clamp(24px, 3vw, 36px)', marginBottom: '20px' }}>
                {section.title}
              </h2>
              <p className="detail-body-text" style={{ marginBottom: section.points ? '24px' : '0' }}>
                {section.content}
              </p>
              {section.points && (
                <div className="pull-quote" style={{ margin: '0 0 32px 0', background: 'var(--bg2)', padding: '24px 32px' }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                    {section.points.map((point, idx) => (
                      <li key={idx} style={{ 
                        color: 'var(--fg2)', 
                        fontSize: '15px', 
                        lineHeight: 1.8, 
                        display: 'flex', 
                        gap: '12px', 
                        marginBottom: idx < section.points!.length - 1 ? '16px' : '0' 
                      }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--or)', flexShrink: 0, marginTop: '10px' }} />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}

          {/* Conclusion */}
          <div className="reveal" style={{ 
            marginTop: '64px', 
            padding: '40px', 
            background: 'var(--bg3)', 
            border: '1px solid var(--border)',
            borderRadius: '12px'
          }}>
            <h2 className="detail-section-title" style={{ fontSize: '28px', marginBottom: '16px' }}>Conclusion</h2>
            <p className="detail-body-text" style={{ margin: 0 }}>
              {post.content.conclusion}
            </p>
          </div>
        </main>

        {/* RIGHT: Sticky sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card reveal">
            <div className="sidebar-title">Post Details</div>

            <div className="sidebar-stat">
              <div className="sidebar-stat-icon"><Calendar /></div>
              <div>
                <div className="sidebar-stat-label">Published</div>
                <div className="sidebar-stat-val">{post.date}</div>
              </div>
            </div>

            <div className="sidebar-stat">
              <div className="sidebar-stat-icon"><Clock /></div>
              <div>
                <div className="sidebar-stat-label">Read Time</div>
                <div className="sidebar-stat-val">{post.readTime}</div>
              </div>
            </div>

            <div className="sidebar-stat">
              <div className="sidebar-stat-icon"><Share2 /></div>
              <div>
                <div className="sidebar-stat-label">Category</div>
                <div className="sidebar-stat-val">{post.category}</div>
              </div>
            </div>

            <div className="sidebar-divider"></div>

            <Link to="/#contact" className="sidebar-btn-fill">
              <Heart size={14} /> Get Involved
            </Link>
            
            <p className="sidebar-note">Support our mission by joining our initiatives or donating.</p>
          </div>
        </aside>
      </div>

      {/* ── CTA BANNER ── */}
      <section className="detail-cta">
        <h2 className="detail-cta-title reveal">Want to Get <span>Involved?</span></h2>
        <p className="detail-cta-sub reveal">Join us in creating sustainable change. Whether through volunteering, partnerships, or donations, your support makes a difference.</p>
        <div className="detail-cta-btns reveal">
          <Link to="/#contact" className="btn-fill">
            Contact Us
          </Link>
          <Link to="/#blog" className="btn-ghost">
            Read More Stories
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
};

export default BlogPost;
