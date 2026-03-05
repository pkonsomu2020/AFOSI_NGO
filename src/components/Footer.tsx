import { Facebook, Instagram, Linkedin, Youtube, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Social Media Section */}
        <div className="text-center mb-8">
          <h3 className="font-heading font-bold text-background text-2xl mb-6">Follow Our Journey</h3>
          <div className="flex justify-center gap-3 flex-wrap">
            <a
              href="https://www.facebook.com/share/19aj6y3Pyx/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="Facebook"
            >
              <Facebook className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.instagram.com/afosi_ke?igsh=MTltaWo3Znc2ZW9wNA=="
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="Instagram"
            >
              <Instagram className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.linkedin.com/company/action-for-sustainability-initiative/"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-6 h-6 text-white" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="YouTube"
            >
              <Youtube className="w-6 h-6 text-white" />
            </a>
            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="X (Twitter)"
            >
              <Twitter className="w-6 h-6 text-white" />
            </a>
            <a
              href="https://www.tiktok.com/@afosi77?_r=1&_t=ZS-944ZocGKLfb"
              target="_blank"
              rel="noopener noreferrer"
              className="w-14 h-14 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center transition-all hover:scale-110 shadow-lg"
              aria-label="TikTok"
            >
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-background/10 pt-6">
          <p className="text-sm text-background/60 text-center">
            © {new Date().getFullYear()} Action For Sustainability Initiative (AFOSI). All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
