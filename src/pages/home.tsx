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
import { Coffee, Leaf, MapPin, Clock, Users, Waypoints } from "lucide-react";

export default function Home() {
  const { showSeasonalMenu } = useFeatureFlags();

  return (
    <>
      <div className="h-[70vh] flex items-center justify-center bg-cover bg-center bg-black/50 bg-blend-overlay bg-[url('https://images.unsplash.com/photo-1495474472287-4d71bcdd2085')]">
        <div className="text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Welcome to Brew Haven</h1>
          <p className="text-xl max-w-2xl mx-auto mb-8">
            Your perfect cup of coffee awaits, crafted with passion and
            precision
          </p>
          <Button asChild size="lg">
            <Link to="/menu">Explore Our Menu</Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coffee className="w-6 h-6" />
                Signature Blends
              </CardTitle>
              <CardDescription>
                Discover our carefully curated selection of premium coffee
                blends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1497935586351-b67a49e012bf"
                alt="Coffee Blends"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link to="/menu">View Menu</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-6 h-6" />
                Community Space
              </CardTitle>
              <CardDescription>
                A perfect place to work, meet, or simply relax with your
                favorite brew.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <img
                src="https://images.unsplash.com/photo-1521017432531-fbd92d768814"
                alt="Coffee Shop Interior"
                className="rounded-lg mb-4 w-full h-48 object-cover"
              />
            </CardContent>
            <CardFooter>
              <Button asChild variant="secondary" className="w-full">
                <Link to="#">Learn More</Link>
              </Button>
            </CardFooter>
          </Card>

          {showSeasonalMenu ? (
            <Card className="border-2 border-coffee hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-6 h-6" />
                  Seasonal Specials
                  <Badge variant="secondary">New</Badge>
                </CardTitle>
                <CardDescription>
                  Try our limited-time seasonal drinks with unique flavors.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1461023058943-07fcbe16d735"
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
          ) : (
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Waypoints className="w-6 h-6" />
                  Artisanal Process
                </CardTitle>
                <CardDescription>
                  Experience our meticulous brewing process and dedication to
                  quality.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src="https://images.unsplash.com/photo-1442512595331-e89e73853f31"
                  alt="Coffee Making Process"
                  className="rounded-lg mb-4 w-full h-48 object-cover"
                />
              </CardContent>
              <CardFooter>
                <Button asChild variant="secondary" className="w-full">
                  <Link to="#">Learn More</Link>
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>

        <Card className="max-w-xl mx-auto">
          <CardContent className="text-center py-8">
            <h2 className="text-2xl font-semibold mb-6">Visit Us Today</h2>
            <div className="flex flex-col items-center justify-center gap-3">
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
    </>
  );
}
