import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { updateFeatureFlag, getFeatureFlags, type Feature } from "@/lib/api";
import { toast } from "@/hooks/use-toast";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function Admin() {
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingFeatures, setUpdatingFeatures] = useState<
    Record<string, boolean>
  >({});

  useEffect(() => {
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    setLoading(true);
    const result = await getFeatureFlags();
    setLoading(false);

    if (result.success && result.data) {
      setFeatures(result.data);
    } else {
      toast({
        variant: "destructive",
        title: "Error loading features",
        description: result.error,
      });
    }
  };

  const handleVariationChange = async (
    feature: Feature,
    variationId: string,
  ) => {
    setUpdatingFeatures((prev) => ({ ...prev, [feature._id]: true }));
    const targets = feature.targets;
    targets[0].distribution[0]._variation = variationId;
    const result = await updateFeatureFlag(feature._id, {
      targets,
    });

    setUpdatingFeatures((prev) => ({ ...prev, [feature._id]: false }));
    handleUpdateResult(result, feature.name);
  };

  const handleExperimentToggle = async (feature: Feature) => {
    setUpdatingFeatures((prev) => ({ ...prev, [feature._id]: true }));
    const data =
      feature.status === "active"
        ? { status: "inactive" }
        : {
            status: "active",
            targets: feature.targets,
          };

    const result = await updateFeatureFlag(feature._id, data);

    setUpdatingFeatures((prev) => ({ ...prev, [feature._id]: false }));
    handleUpdateResult(result, feature.name);
  };

  const handleUpdateResult = (
    result: { success: boolean; error?: string },
    featureName: string,
  ) => {
    if (!result.success) {
      toast({
        variant: "destructive",
        title: "Failed to update feature",
        description: result.error,
      });
    } else {
      toast({
        title: "Feature updated",
        description: `${featureName} updated successfully`,
      });
      loadFeatures();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Feature Administration</h1>
        <Button onClick={loadFeatures}>Refresh Features</Button>
      </div>

      <div className="grid gap-6">
        {features.map((feature) => (
          <Card key={feature._id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{feature.name}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </div>
                <Badge>{feature.type}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {feature.type === "release" ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Current Variation</span>
                    <div className="flex items-center gap-x-2">
                      <Select
                        value={feature.targets[0].distribution[0]._variation}
                        onValueChange={(value) =>
                          handleVariationChange(feature, value)
                        }
                        disabled={updatingFeatures[feature._id]}
                      >
                        <SelectTrigger className="w-[200px]">
                          <SelectValue placeholder="Select variation" />
                        </SelectTrigger>
                        <SelectContent>
                          {feature.variations.map((variation) => (
                            <SelectItem
                              key={variation._id}
                              value={variation._id}
                            >
                              {variation.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {updatingFeatures[feature._id] && (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Current Variables:</h4>
                    <div className="space-y-2">
                      {Object.entries(
                        feature.variations.find(
                          (v) =>
                            v._id ===
                            feature.targets[0].distribution[0]._variation,
                        )?.variables ?? {},
                      ).map(([key, value]) => (
                        <div key={key} className="flex justify-between text-sm">
                          <span>{key}:</span>
                          <span className="font-mono">{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Experiment Status</span>
                    <div className="flex items-center gap-x-2">
                      <Switch
                        checked={feature.status === "active"}
                        onCheckedChange={() => handleExperimentToggle(feature)}
                        disabled={updatingFeatures[feature._id]}
                      />
                      {updatingFeatures[feature._id] && (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      )}
                    </div>
                  </div>

                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Traffic Distribution:</h4>
                    <div className="space-y-2">
                      {feature.targets[0].distribution.map((dist) => {
                        const variation = feature.variations.find(
                          (v) => v._id === dist._variation,
                        );
                        return (
                          <div
                            key={dist._variation}
                            className="flex justify-between text-sm"
                          >
                            <span>{variation?.name ?? "Unknown"}</span>
                            <span>{(dist.percentage * 100).toFixed(0)}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
