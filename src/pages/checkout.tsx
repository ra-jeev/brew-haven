import { useState } from "react";
import { Link } from "react-router-dom";

import { useToast } from "@/hooks/use-toast";
import { useFeatureFlags } from "@/hooks/use-feature-flags";
import { useCartStore } from "@/stores/cartStore";
import { useOrderStore } from "@/stores/orderStore";

import { formatCurrency } from "@/lib/utils";

import { ShoppingBag } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Checkout() {
  const { enableOnlinePayment, enableLoyaltyPoints, enableLiveOrderTracking } =
    useFeatureFlags();

  const { items, clearCart } = useCartStore();
  const {
    createOrder,
    currentOrder,
    updateOrderStatus,
    availableLoyaltyPoints,
    setLoyaltyPoints,
  } = useOrderStore();

  const [orderPlaced, setOrderPlaced] = useState(false);
  const [pointsApplied, setPointsApplied] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("card");

  const subtotal = items.reduce(
    (sum, item) => sum + item.totalPrice * item.quantity,
    0,
  );
  const loyaltyDiscount = pointsApplied ? availableLoyaltyPoints / 100 : 0;
  const total = +(subtotal - loyaltyDiscount).toFixed(2);

  const { toast } = useToast();
  const handleApplyPoints = () => {
    if (!pointsApplied && availableLoyaltyPoints) {
      setPointsApplied(true);
      setLoyaltyPoints(0);
      toast({
        title: "Loyalty Points Applied",
        description: "Your loyalty points have been applied to this order.",
      });
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "Cart Cleared",
      description: "All items have been removed from your cart.",
    });
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    const newOrder = {
      items: [...items],
      subtotal,
      discount: loyaltyDiscount,
      total,
      status: "Preparing" as const,
      paymentMethod,
      loyaltyPointsApplied: pointsApplied,
      estimatedPickupTime: "15-20 minutes",
    };

    createOrder(newOrder);
    setOrderPlaced(true);
    clearCart();

    if (enableLiveOrderTracking) {
      setTimeout(() => {
        const orderId = useOrderStore.getState().currentOrder?.id;
        if (orderId) {
          setTimeout(() => updateOrderStatus(orderId, "Brewing"), 2000);
          setTimeout(() => updateOrderStatus(orderId, "Quality Check"), 4000);
          setTimeout(
            () => updateOrderStatus(orderId, "Ready for Pickup"),
            6000,
          );
        }
      }, 0);
    }
  };

  const displayItems = orderPlaced && currentOrder ? currentOrder.items : items;
  const displayTotal = orderPlaced && currentOrder ? currentOrder.total : total;
  const displayStatus = orderPlaced && currentOrder ? currentOrder.status : "";

  if (items.length === 0 && !orderPlaced) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        <Card className="text-center p-6">
          <CardContent>
            <ShoppingBag className="w-10 h-10 mx-auto text-muted-foreground" />
            <h2 className="text-2xl font-semibold mt-4 mb-2">
              Your cart is empty
            </h2>
            <p className="text-muted-foreground">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button asChild className="mt-8">
              <Link to="/menu">Browse Menu</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Checkout</h1>
        {!orderPlaced && items.length > 0 && (
          <Button
            variant="outline"
            onClick={handleClearCart}
            className="text-destructive hover:text-destructive"
          >
            Clear Cart
          </Button>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>
                {orderPlaced ? "Order Summary" : "Cart Summary"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} x{item.quantity}
                      {item.selectedCustomizations?.map((custom) => (
                        <span
                          key={custom.name}
                          className="text-sm text-muted-foreground block ml-2"
                        >
                          + {custom.name}
                        </span>
                      ))}
                    </span>
                    <span>
                      {formatCurrency(item.totalPrice * item.quantity)}
                    </span>
                  </div>
                ))}

                {orderPlaced
                  ? currentOrder?.loyaltyPointsApplied && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-muted-foreground">
                          <span>Loyalty Points Discount</span>
                          <span>
                            -{formatCurrency(currentOrder.discount ?? 0)}
                          </span>
                        </div>
                      </>
                    )
                  : pointsApplied && (
                      <>
                        <Separator />
                        <div className="flex justify-between text-muted-foreground">
                          <span>Loyalty Points Discount</span>
                          <span>-{formatCurrency(loyaltyDiscount)}</span>
                        </div>
                      </>
                    )}

                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>{formatCurrency(displayTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {enableLoyaltyPoints && !orderPlaced && (
            <Card>
              <CardHeader>
                <CardTitle>Loyalty Points</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-2">
                  You have {availableLoyaltyPoints} points available
                </p>
                {availableLoyaltyPoints > 0 && (
                  <Button
                    variant="link"
                    className="text-primary p-0"
                    onClick={handleApplyPoints}
                    disabled={pointsApplied}
                  >
                    {pointsApplied
                      ? "Points Applied (-$1.50)"
                      : "Apply points to this order"}
                  </Button>
                )}
              </CardContent>
            </Card>
          )}

          {!orderPlaced && (
            <Card>
              <CardHeader>
                <CardTitle>Estimated Pickup Time</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-muted-foreground">
                  15-20 minutes
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Payment Section */}
        <div className="space-y-6">
          {!orderPlaced ? (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                </CardHeader>
                <CardContent>
                  {enableOnlinePayment ? (
                    <RadioGroup
                      defaultValue="card"
                      value={paymentMethod}
                      onValueChange={setPaymentMethod}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card">Credit/Debit Card</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="applepay" id="applepay" />
                        <Label htmlFor="applepay">Apple Pay</Label>
                      </div>
                    </RadioGroup>
                  ) : (
                    <p className="text-muted-foreground">
                      Pay in store at pickup
                    </p>
                  )}
                </CardContent>
              </Card>

              <Button
                onClick={handlePlaceOrder}
                className="w-full"
                size="lg"
                disabled={items.length === 0}
              >
                Place Order
              </Button>
            </>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Order Confirmed!</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Thank you for your order. Your order number is #1234.
                </p>
                {enableLiveOrderTracking && (
                  <div className="space-y-4">
                    <Badge variant="secondary">{displayStatus}</Badge>
                    <Progress
                      value={
                        displayStatus === "Preparing"
                          ? 25
                          : displayStatus === "Brewing"
                            ? 50
                            : displayStatus === "Quality Check"
                              ? 75
                              : displayStatus === "Ready for Pickup"
                                ? 100
                                : 0
                      }
                      className="h-2"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
