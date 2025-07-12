
import { Button } from "@/components/ui/button";
import { ArrowRight, Recycle, Users, Heart } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sage-50 to-terracotta-50 pt-16 pb-24">
      <div className="container relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-12 h-12 rounded-full gradient-sage flex items-center justify-center">
                <Recycle className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                Sustainable Fashion
              </span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
              Give Your Clothes a 
              <span className="text-primary"> Second Life</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg">
              Join ReWear's community-driven clothing exchange. Swap items directly with others or use our point system to discover your next favorite piece – all while reducing textile waste.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="gradient-sage text-white hover:opacity-90 group">
                Start Swapping
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                Browse Items
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">2.5K+</div>
                <div className="text-sm text-muted-foreground">Items Exchanged</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">850+</div>
                <div className="text-sm text-muted-foreground">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">95%</div>
                <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="relative animate-slide-up">
            <div className="relative z-10">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="space-y-4">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                      <Users className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Community Driven</h3>
                    <p className="text-sm text-muted-foreground">Connect with like-minded fashion lovers in your area</p>
                  </div>
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
                    <div className="w-12 h-12 rounded-full bg-terracotta-100 flex items-center justify-center mb-4">
                      <Heart className="w-6 h-6 text-terracotta-500" />
                    </div>
                    <h3 className="font-semibold mb-2">Eco-Friendly</h3>
                    <p className="text-sm text-muted-foreground">Reduce waste and give clothes a second chance</p>
                  </div>
                </div>
                <div className="space-y-4 pt-8">
                  <div className="bg-white rounded-2xl p-6 shadow-lg hover-lift">
                    <div className="w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-4">
                      <Recycle className="w-6 h-6 text-sage-600" />
                    </div>
                    <h3 className="font-semibold mb-2">Easy Swapping</h3>
                    <p className="text-sm text-muted-foreground">Simple process to exchange items you love</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-br from-primary/20 to-terracotta-200/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-gradient-to-br from-terracotta-200/20 to-primary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
