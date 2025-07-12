
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Star, MapPin } from "lucide-react";
import { useState } from "react";

const featuredItems = [
  {
    id: 1,
    title: "Vintage Denim Jacket",
    description: "Classic blue denim jacket, barely worn",
    category: "Outerwear",
    size: "M",
    condition: "Like New",
    points: 25,
    location: "Brooklyn, NY",
    image: "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=400&h=400&fit=crop",
    liked: false,
    rating: 4.8
  },
  {
    id: 2,
    title: "Floral Summer Dress",
    description: "Beautiful floral print, perfect for spring",
    category: "Dresses",
    size: "S",
    condition: "Good",
    points: 30,
    location: "San Francisco, CA",
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    liked: true,
    rating: 4.9
  },
  {
    id: 3,
    title: "Designer Sneakers",
    description: "Comfortable white sneakers, lightly used",
    category: "Shoes",
    size: "9",
    condition: "Good",
    points: 40,
    location: "Austin, TX",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
    liked: false,
    rating: 4.7
  },
  {
    id: 4,
    title: "Cashmere Sweater",
    description: "Soft beige cashmere, cozy and warm",
    category: "Tops",
    size: "L",
    condition: "Excellent",
    points: 45,
    location: "Seattle, WA",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop",
    liked: false,
    rating: 5.0
  }
];

const FeaturedItems = () => {
  const [items, setItems] = useState(featuredItems);

  const toggleLike = (id: number) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, liked: !item.liked } : item
    ));
  };

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured Items
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing pieces from our community. Each item has been carefully reviewed and is ready for its next adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="group hover-lift overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={item.image} 
                  alt={item.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    className={`w-8 h-8 p-0 rounded-full ${item.liked ? 'text-red-500 bg-white/90' : 'text-white bg-black/20'} hover:bg-white/90 hover:text-red-500`}
                    onClick={() => toggleLike(item.id)}
                  >
                    <Heart className={`w-4 h-4 ${item.liked ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <div className="absolute top-3 left-3">
                  <Badge variant="secondary" className="bg-white/90 text-foreground">
                    {item.condition}
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="flex items-center gap-1 mb-2">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{item.rating}</span>
                </div>

                <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                  {item.title}
                </h3>
                
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Size {item.size}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3" />
                    {item.location}
                  </div>
                  <div className="text-sm font-medium text-primary">
                    {item.points} points
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1 text-xs">
                    Swap Request
                  </Button>
                  <Button size="sm" className="flex-1 text-xs gradient-sage text-white">
                    Use Points
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
            View All Items
          </Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedItems;
