import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Feature Flag Configuration
const FEATURE_FLAGS = {
  PROMO_BANNERS: true,
  DAILY_SPECIALS: true,
  RECOMMENDATION_ALGO: false,
  SEASONAL_MENU: true,
  BETA_ORDER_CUSTOMIZATION: false,
  LOCATION_PROMOS: true,
  PICKUP_DELIVERY_TOGGLE: true,
};

type MenuItem = {
  id: number;
  name: string;
  category: string;
  price: number;
  seasonal: boolean;
  dietaryInfo: string;
};

// Mock Data
const MENU_ITEMS = [
  {
    id: 1,
    name: "Espresso",
    category: "Coffee",
    price: 3.5,
    seasonal: false,
    dietaryInfo: "Vegan",
  },
  {
    id: 2,
    name: "Cappuccino",
    category: "Coffee",
    price: 4.25,
    seasonal: true,
    dietaryInfo: "Contains Dairy",
  },
  {
    id: 3,
    name: "Chocolate Croissant",
    category: "Pastry",
    price: 3.75,
    seasonal: false,
    dietaryInfo: "Contains Gluten",
  },
  {
    id: 4,
    name: "Pumpkin Spice Latte",
    category: "Seasonal",
    price: 5.0,
    seasonal: true,
    dietaryInfo: "Contains Dairy",
  },
];

const DAILY_SPECIALS = [
  {
    id: "special1",
    name: "Morning Brew Bundle",
    description: "2 Espressos + Croissant",
    price: 8.5,
  },
  {
    id: "special2",
    name: "Afternoon Delight",
    description: "Cappuccino + Cookie",
    price: 6.75,
  },
];

const CoffeeShopApp = () => {
  const [menuItems] = useState<MenuItem[]>(MENU_ITEMS);
  const [dietaryFilter, setDietaryFilter] = useState("All Items");
  const [orderType, setOrderType] = useState("pickup");
  const [selectedItems, setSelectedItems] = useState<MenuItem[]>([]);

  const filterMenu = (items: MenuItem[]) => {
    return items.filter(
      (item) =>
        dietaryFilter === "All Items" ||
        item.dietaryInfo.toLowerCase().includes(dietaryFilter.toLowerCase()),
    );
  };

  const addToOrder = (item: MenuItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  const removeFromOrder = (itemToRemove: MenuItem) => {
    setSelectedItems(
      selectedItems.filter((item) => item.id !== itemToRemove.id),
    );
  };

  const calculateTotal = () => {
    return selectedItems
      .reduce((total, item) => total + item.price, 0)
      .toFixed(2);
  };

  return (
    <div className="container mx-auto p-4">
      <header>
        <h1 className="text-2xl font-bold">Coffee Shop Feature Flag Demo</h1>
      </header>

      {FEATURE_FLAGS.PROMO_BANNERS && (
        <Alert variant="default" className="mb-4">
          Special Promotion: 10% Off All Drinks This Week!
        </Alert>
      )}

      {FEATURE_FLAGS.DAILY_SPECIALS && (
        <Card className="mb-4">
          <CardHeader>
            <CardTitle>Today's Specials</CardTitle>
          </CardHeader>
          <CardContent>
            {DAILY_SPECIALS.map((special) => (
              <div key={special.id} className="flex justify-between mb-2">
                <span>{special.name}</span>
                <span>${special.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Menu</CardTitle>
        </CardHeader>
        <CardContent>
          {FEATURE_FLAGS.PICKUP_DELIVERY_TOGGLE && (
            <div className="mb-4">
              <Select value={orderType} onValueChange={setOrderType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Order Type">
                    {orderType === "pickup" ? "Pickup" : "Delivery"}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pickup">Pickup</SelectItem>
                  <SelectItem value="delivery">Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {FEATURE_FLAGS.SEASONAL_MENU && (
            <Badge variant="outline" className="mb-2">
              Seasonal Items Available!
            </Badge>
          )}

          <div className="mb-4">
            <Select value={dietaryFilter} onValueChange={setDietaryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Dietary Filter">
                  {dietaryFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Items">All Items</SelectItem>
                <SelectItem value="Vegan">Vegan</SelectItem>
                <SelectItem value="Dairy">Dairy</SelectItem>
                <SelectItem value="Gluten">Gluten</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filterMenu(menuItems).map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2 p-2 border rounded"
            >
              <div>
                <span className="font-bold">{item.name}</span>
                {item.seasonal && (
                  <Badge variant="secondary" className="ml-2">
                    Seasonal
                  </Badge>
                )}
                <div className="text-sm text-gray-500">{item.dietaryInfo}</div>
              </div>
              <div className="flex items-center">
                <span className="mr-2">${item.price.toFixed(2)}</span>
                <Button onClick={() => addToOrder(item)} size="sm">
                  Add to Order
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Order</CardTitle>
        </CardHeader>
        <CardContent>
          {selectedItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-2"
            >
              <span>{item.name}</span>
              <div>
                <span className="mr-2">${item.price.toFixed(2)}</span>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeFromOrder(item)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
          <div className="mt-4 font-bold">Total: ${calculateTotal()}</div>
          {orderType === "delivery" && (
            <Alert variant="default" className="mt-2">
              Delivery fees may apply
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoffeeShopApp;
