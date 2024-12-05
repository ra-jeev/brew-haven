import { useFeatureFlags, FeatureFlags } from "@/stores/featureFlags";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useState } from "react";

export default function Admin() {
  const featureFlags = useFeatureFlags();
  const [showResetAlert, setShowResetAlert] = useState(false);

  const flagCategories = {
    "Menu Features": [
      "showSeasonalMenu",
      "showNutritionInfo",
      "enableCustomization",
    ],
    "Checkout Features": [
      "enableOnlinePayment",
      "enableLoyaltyPoints",
      "showEstimatedPickupTime",
    ],
    "UI/UX Features": [
      "enableDarkMode",
      "showPromotionalBanner",
      "enableLiveOrderTracking",
    ],
  };

  const getFlagDisplayName = (flag: string) => {
    return flag
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (str) => str.toUpperCase());
  };

  const handleReset = () => {
    featureFlags.resetFlags();
    setShowResetAlert(true);
    setTimeout(() => setShowResetAlert(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">
          Feature Flag Administration
        </h1>
        <Button variant="destructive" onClick={handleReset} className="ml-4">
          Reset All Flags
        </Button>
      </div>

      {showResetAlert && (
        <Alert className="mb-6">
          <AlertDescription>
            All feature flags have been reset to their default values.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {Object.entries(flagCategories).map(([category, flags]) => (
          <Card key={category}>
            <CardHeader>
              <CardTitle>{category}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {flags.map((flag) => (
                <div
                  key={flag}
                  className="flex items-center justify-between p-4 bg-muted/50 rounded-lg"
                >
                  <div className="space-y-1">
                    <h3 className="font-medium text-foreground">
                      {getFlagDisplayName(flag)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Status:{" "}
                      <span
                        className={
                          featureFlags[flag as keyof FeatureFlags]
                            ? "text-green-600 dark:text-green-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        {featureFlags[flag as keyof FeatureFlags]
                          ? "Enabled"
                          : "Disabled"}
                      </span>
                    </p>
                  </div>
                  <Switch
                    checked={featureFlags[flag as keyof FeatureFlags]}
                    onCheckedChange={(checked) =>
                      featureFlags.setFeatureFlag(
                        flag as keyof FeatureFlags,
                        checked,
                      )
                    }
                    aria-label={`Toggle ${getFlagDisplayName(flag)}`}
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
