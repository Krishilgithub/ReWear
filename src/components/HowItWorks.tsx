
import { Card, CardContent } from "@/components/ui/card";
import { Upload, Users, Repeat, Award } from "lucide-react";

const steps = [
  {
    icon: Upload,
    title: "Upload Your Items",
    description: "Take photos and describe clothes you no longer wear. Add details like size, condition, and style.",
    color: "bg-primary/10 text-primary"
  },
  {
    icon: Users,
    title: "Connect with Others",
    description: "Browse items from our community. Find pieces that match your style and size preferences.",
    color: "bg-terracotta-100 text-terracotta-600"
  },
  {
    icon: Repeat,
    title: "Make the Swap",
    description: "Request a direct swap or use points to claim items. Coordinate pickup or shipping details.",
    color: "bg-sage-100 text-sage-600"
  },
  {
    icon: Award,
    title: "Earn & Enjoy",
    description: "Earn points for successful swaps. Build your reputation and discover more amazing pieces.",
    color: "bg-yellow-100 text-yellow-600"
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 bg-gradient-to-br from-sage-50/50 to-terracotta-50/50">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How ReWear Works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Simple steps to start your sustainable fashion journey. Join thousands who are already making a difference.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <Card key={index} className="relative hover-lift border-0 shadow-md bg-white/50 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="relative mb-6">
                    <div className={`w-16 h-16 rounded-2xl ${step.color} flex items-center justify-center mx-auto mb-4`}>
                      <Icon className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {step.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Points System
              </h3>
              <p className="text-muted-foreground mb-6">
                Earn points by listing items and completing successful swaps. Use points to claim items without direct trades.
              </p>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-sage-50 rounded-lg">
                  <span className="text-sm font-medium">List an item</span>
                  <span className="text-primary font-bold">+5 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-terracotta-50 rounded-lg">
                  <span className="text-sm font-medium">Complete a swap</span>
                  <span className="text-primary font-bold">+10 points</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Receive 5-star rating</span>
                  <span className="text-primary font-bold">+3 points</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 mx-auto rounded-full gradient-sage flex items-center justify-center mb-4">
                <Award className="w-16 h-16 text-white" />
              </div>
              <h4 className="text-lg font-semibold mb-2">Start with 20 Points</h4>
              <p className="text-sm text-muted-foreground">Every new member gets bonus points to start their ReWear journey</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
