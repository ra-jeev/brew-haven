import { useOrderStore } from "@/stores/orderStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

export default function Orders() {
  const { orderHistory } = useOrderStore();

  const getStatusBadgeVariant = (status: string) => {
    if (["Ready for Pickup", "Completed"].includes(status)) {
      return "default";
    }

    return "secondary";
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Order History</h1>

      <div className="space-y-6">
        {orderHistory.length === 0 ? (
          <p className="text-muted-foreground">No orders yet</p>
        ) : (
          orderHistory.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Order #{order.id}</CardTitle>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-sm text-muted-foreground">
                    {new Date(order.orderDate).toLocaleDateString()} at{" "}
                    {new Date(order.orderDate).toLocaleTimeString()}
                  </div>

                  {order.items.map((item) => (
                    <div key={item.id} className="flex justify-between">
                      <div>
                        <span className="font-medium">
                          {item.name} x{item.quantity}
                        </span>
                        {item.selectedCustomizations?.map((custom) => (
                          <span
                            key={custom.name}
                            className="text-sm text-muted-foreground block ml-2"
                          >
                            + {custom.name}
                          </span>
                        ))}
                      </div>
                      <span>{formatCurrency(item.totalPrice)}</span>
                    </div>
                  ))}

                  <Separator />

                  {order.promotionApplied &&
                    order.promotionApplied.discount > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>
                          Promotion Discount
                          {order.promotionApplied.type === "percentage" &&
                            ` (${order.promotionApplied.value}%)`}
                        </span>
                        <span>
                          -{formatCurrency(order.promotionApplied.discount)}
                        </span>
                      </div>
                    )}

                  {order.loyaltyDiscount && order.loyaltyDiscount > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Loyalty Points Discount</span>
                      <span>-{formatCurrency(order.loyaltyDiscount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between font-semibold">
                    <span>Total</span>
                    <span>{formatCurrency(order.total)}</span>
                  </div>

                  {order.paymentMethod && (
                    <div className="text-sm text-muted-foreground">
                      Paid via {order.paymentMethod}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
