import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    slug: "we-lead-program",
    title: "We Lead Program",
    excerpt: "The We Lead Project, funded by HIVOS East Africa through the Center for Adolescence (CSA), is designed to empower young women facing multiple barriers...",
    image: "https://afosi.org/assets/images/we_lead.webp",
    category: "Empowerment",
    date: "March 2024",
    readTime: "5 min read",
  },
  {
    slug: "robotics-creative-coding",
    title: "Robotics and Creative Coding",
    excerpt: "Health, Education, Environment, Livelihoods, and Leadership form the backbone of sustainable development...",
    image: "https://afosi.org/assets/images/robotics.webp",
    category: "Education",
    date: "February 2024",
    readTime: "4 min read",
  },
  {
    slug: "westo-recyclers",
    title: "Westo Recyclers",
    excerpt: "An innovative eco-entrepreneurship initiative transforming everyday waste into valuable resources in Nairobi's informal settlements...",
    image: "https://afosi.org/assets/images/westo.webp",
    category: "Environment",
    date: "January 2024",
    readTime: "6 min read",
  },
  {
    slug: "kiongozi-platform",
    title: "Kiongozi Platform",
    excerpt: "An emerging leaders platform providing mentorship, capacity-building, and leadership training for grassroots youth, women, and persons with disabilities...",
    image: "https://afosi.org/assets/images/kiongozi.webp",
    category: "Leadership",
    date: "December 2023",
    readTime: "5 min read",
  },
];

const BlogSection = () => {
  return (
    <section id="blog" className="relative py-16 sm:py-20 md:py-24 lg:py-32 overflow-hidden bg-background">
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-heading font-bold text-foreground mb-4 leading-tight">
            Our <span className="text-primary">Blog</span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Latest stories and insights from our work
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {blogPosts.map((post, i) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative rounded-2xl overflow-hidden bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer"
            >
              <Link to={`/blog/${post.slug}`}>
                {/* Image with overlay */}
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/70 transition-colors" />
                  
                  {/* Category badge */}
                  <Badge className="absolute top-4 left-4 bg-primary/90 backdrop-blur-sm text-primary-foreground border-0 shadow-lg">
                    {post.category}
                  </Badge>
                </div>

                {/* Content */}
                <div className="p-5 sm:p-6">
                  {/* Meta info */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={14} />
                      <span>{post.date}</span>
                    </div>
                    <span>•</span>
                    <span>{post.readTime}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground mb-3 group-hover:text-primary transition-colors leading-tight">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>

                  {/* Read more link */}
                  <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                    <span>Read More</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>

                {/* Hover effect border */}
                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/20 rounded-2xl transition-colors pointer-events-none" />
              </Link>
            </motion.article>
          ))}
        </div>

        {/* View all button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12 sm:mt-16"
        >
          <Button variant="outline" size="lg" className="group shadow-lg hover:shadow-xl" asChild>
            <a href="#blog">
              View All Stories
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </a>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default BlogSection;
