import { Link } from "react-router-dom";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Coffee, Leaf, MapPin, Clock } from "lucide-react";

export default function Home() {
  const { showSeasonalMenu } = useFeatureFlags();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-foreground">
          Welcome to Brew Haven
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your perfect cup of coffee awaits, crafted with passion and precision
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Coffee className="w-6 h-6" />
              Our Signature Blends
            </CardTitle>
            <CardDescription>
              Discover our carefully curated selection of premium coffee blends,
              sourced from the finest coffee regions around the world.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <img
              src="/api/placeholder/600/400"
              alt="Coffee Blends"
              className="rounded-lg mb-4 w-full h-48 object-cover"
            />
          </CardContent>
          <CardFooter>
            <Button asChild variant="outline" className="w-full">
              <Link to="/menu">View Menu</Link>
            </Button>
          </CardFooter>
        </Card>

        {showSeasonalMenu && (
          <Card className="border-2 border-coffee hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-6 h-6" />
                Seasonal Specials
                <Badge variant="secondary">New</Badge>
              </CardTitle>
              <CardDescription>
                Try our limited-time seasonal drinks, crafted to perfection with
                unique flavors and premium ingredients.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="/api/placeholder/600/400"
                alt="Seasonal Specials"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link to="/menu">View Seasonal Menu</Link>
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>

      <Card className="max-w-xl mx-auto">
        <CardContent className="text-center py-8">
          <h2 className="text-2xl font-semibold mb-4">Visit Us Today</h2>
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>123 Coffee Street, Brewville, BV 12345</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>6:00 AM - 8:00 PM</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
