
import { Heart, Mail, Instagram, Twitter, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg gradient-sage flex items-center justify-center">
                <Heart className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold">ReWear</span>
            </div>
            <p className="text-sm text-muted opacity-80">
              Building a sustainable future through community-driven clothing exchange.
            </p>
            <div className="flex space-x-3">
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-background hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-background hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="ghost" className="w-8 h-8 p-0 text-background hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#browse" className="opacity-80 hover:opacity-100 transition-opacity">Browse Items</a></li>
              <li><a href="#how-it-works" className="opacity-80 hover:opacity-100 transition-opacity">How It Works</a></li>
              <li><a href="#about" className="opacity-80 hover:opacity-100 transition-opacity">About Us</a></li>
              <li><a href="#contact" className="opacity-80 hover:opacity-100 transition-opacity">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#faq" className="opacity-80 hover:opacity-100 transition-opacity">FAQ</a></li>
              <li><a href="#guidelines" className="opacity-80 hover:opacity-100 transition-opacity">Community Guidelines</a></li>
              <li><a href="#safety" className="opacity-80 hover:opacity-100 transition-opacity">Safety Tips</a></li>
              <li><a href="#help" className="opacity-80 hover:opacity-100 transition-opacity">Help Center</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="font-semibold mb-4">Stay Updated</h4>
            <p className="text-sm opacity-80 mb-4">Get the latest on sustainable fashion and community updates.</p>
            <div className="flex space-x-2">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-3 py-2 text-sm rounded-lg bg-background/10 border border-background/20 text-background placeholder:text-background/60 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button size="sm" className="gradient-sage">
                <Mail className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="border-t border-background/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm opacity-80">© 2024 ReWear. All rights reserved.</p>
            <div className="flex space-x-6 text-sm">
              <a href="#privacy" className="opacity-80 hover:opacity-100 transition-opacity">Privacy Policy</a>
              <a href="#terms" className="opacity-80 hover:opacity-100 transition-opacity">Terms of Service</a>
              <a href="#cookies" className="opacity-80 hover:opacity-100 transition-opacity">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
