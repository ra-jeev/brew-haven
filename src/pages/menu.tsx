import { useState } from "react";

import { useToast } from "@/hooks/use-toast";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useCartStore, type CartItem, type MenuItem } from "@/stores/cartStore";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Classic Espresso",
    description: "Rich and bold single shot of espresso",
    price: 3.5,
    category: "Coffee",
    nutritionInfo: {
      calories: 1,
      protein: 0,
      carbs: 0,
    },
    customizationOptions: [
      { name: "Extra Shot", price: 0.75 },
      { name: "Decaf", price: 0 },
    ],
  },
  {
    id: 2,
    name: "Caramel Macchiato",
    description: "Espresso with steamed milk and vanilla, topped with caramel",
    price: 4.75,
    category: "Coffee",
    nutritionInfo: {
      calories: 250,
      protein: 10,
      carbs: 35,
    },
    customizationOptions: [
      { name: "Extra Shot", price: 0.75 },
      { name: "Sugar-Free Syrup", price: 0.25 },
      { name: "Soy Milk", price: 0.5 },
      { name: "Oat Milk", price: 0.5 },
    ],
  },
  {
    id: 3,
    name: "Pumpkin Spice Latte",
    description: "Espresso with pumpkin spice, steamed milk, and whipped cream",
    price: 5.5,
    category: "Coffee",
    seasonal: true,
    nutritionInfo: {
      calories: 380,
      protein: 14,
      carbs: 52,
    },
    customizationOptions: [
      { name: "Extra Shot", price: 0.75 },
      { name: "No Whip", price: -0.25 },
      { name: "Sugar-Free Syrup", price: 0.25 },
    ],
  },
];

export default function Menu() {
  const { toast } = useToast();
  const { showSeasonalMenu, showNutritionInfo, enableMenuCustomization } =
    useFeatureFlags();

  const filteredMenu = menuItems.filter(
    (item) => !item.seasonal || (item.seasonal && showSeasonalMenu),
  );

  const { addToCart } = useCartStore();
  const [customizations, setCustomizations] = useState<{
    [itemId: number]: {
      [optionName: string]: boolean;
    };
  }>({});

  const handleAddToCart = (item: MenuItem) => {
    // Collect selected customizations
    const selectedCustoms =
      item.customizationOptions?.filter(
        (option) => customizations[item.id]?.[option.name],
      ) || [];

    // Calculate total price with customizations
    const totalPrice = calculateTotalPrice(item);

    const cartItem: CartItem = {
      ...item,
      quantity: 1,
      selectedCustomizations: selectedCustoms,
      totalPrice: totalPrice,
    };

    addToCart(cartItem);

    setCustomizations((prev) => ({
      ...prev,
      [item.id]: {},
    }));

    toast({
      title: "Added to Cart",
      description: `${item.name} has been added to your cart`,
    });
  };

  const calculateTotalPrice = (item: MenuItem) => {
    if (!item.customizationOptions) return item.price;

    const itemCustoms = customizations[item.id] || {};
    const extraCost = item.customizationOptions.reduce((total, option) => {
      return total + (itemCustoms[option.name] ? option.price : 0);
    }, 0);

    return item.price + extraCost;
  };

  const toggleCustomization = (itemId: number, optionName: string) => {
    setCustomizations((prev) => ({
      ...prev,
      [itemId]: {
        ...(prev[itemId] || {}),
        [optionName]: !(prev[itemId]?.[optionName] || false),
      },
    }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-foreground">Our Menu</h1>

      <div className="space-y-6">
        {filteredMenu.map((item) => (
          <Card key={item.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="space-y-2">
                  <CardTitle className="flex items-center gap-2">
                    {item.name}
                    {item.seasonal && (
                      <Badge variant="secondary">Seasonal</Badge>
                    )}
                  </CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </div>
                <div className="text-2xl font-semibold">
                  ${calculateTotalPrice(item).toFixed(2)}
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <Accordion type="single" collapsible>
                {showNutritionInfo && item.nutritionInfo && (
                  <AccordionItem value="nutrition">
                    <AccordionTrigger>Nutrition Information</AccordionTrigger>
                    <AccordionContent>
                      <Table>
                        <TableBody>
                          <TableRow>
                            <TableCell>Calories</TableCell>
                            <TableCell>{item.nutritionInfo.calories}</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Protein</TableCell>
                            <TableCell>{item.nutritionInfo.protein}g</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Carbs</TableCell>
                            <TableCell>{item.nutritionInfo.carbs}g</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </AccordionContent>
                  </AccordionItem>
                )}

                {enableMenuCustomization && item.customizationOptions && (
                  <AccordionItem value="customization">
                    <AccordionTrigger>Customization Options</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-2">
                        {item.customizationOptions.map((option) => (
                          <div
                            key={option.name}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`${item.id}-${option.name}`}
                              checked={!!customizations[item.id]?.[option.name]}
                              onCheckedChange={() =>
                                toggleCustomization(item.id, option.name)
                              }
                            />
                            <Label
                              htmlFor={`${item.id}-${option.name}`}
                              className="flex justify-between w-full"
                            >
                              {option.name}
                              {
                                <span className="text-muted-foreground">
                                  {option.price >= 0 ? "+" : "-"}$
                                  {Math.abs(option.price).toFixed(2)}
                                </span>
                              }
                            </Label>
                          </div>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )}
              </Accordion>
              <Button
                onClick={() => handleAddToCart(item)}
                className="w-full mt-4"
              >
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
