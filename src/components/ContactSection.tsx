import { motion } from "framer-motion";
import { MapPin, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const ContactSection = () => {
  return (
    <section id="contact" className="py-24 bg-accent/30">
      <div className="container mx-auto px-4 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Get In <span className="text-primary">Touch</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Ready to make a difference? Let's connect and create sustainable change together
          </p>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: MapPin, title: "Address", lines: ["Manga Hse, Kiambere RD", "Upper Hill - Nairobi, Kenya"] },
              { icon: Phone, title: "Phone", lines: ["(+254) 0115963306"], href: "tel:+254115963306" },
              { icon: Mail, title: "Email", lines: ["info@afosi.org"], href: "mailto:info@afosi.org" },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center bg-background rounded-2xl p-6 shadow-sm border border-border"
              >
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <item.icon className="w-6 h-6 text-primary-foreground" />
                </div>
                <h4 className="font-heading font-semibold text-foreground mb-4 text-base">{item.title}</h4>
                
                <div className="space-y-1.5">
                  {item.lines.map((line) =>
                    item.href ? (
                      <a key={line} href={item.href} className="text-sm text-muted-foreground hover:text-primary transition-colors block">
                        {line}
                      </a>
                    ) : (
                      <p key={line} className="text-sm text-muted-foreground leading-relaxed">{line}</p>
                    )
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <Button variant="hero" size="lg" asChild>
              <a href="mailto:info@afosi.org">Send Us a Message</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
