export interface Feature {
  _id: string;
  key: string;
  name: string;
  description: string;
  type: "release" | "experiment";
  status: string;
  variations: {
    _id: string;
    key: string;
    name: string;
    variables: Record<string, boolean | string | number>;
  }[];
  currentVariation?: string;
  distributions?: Array<{
    _variation: string;
    percentage: number;
  }>;
}

export async function getFeatureFlags() {
  try {
    const response = await fetch("/.netlify/functions/feature-flags");
    if (!response.ok) throw new Error("Failed to fetch flags");
    const data = await response.json();
    console.log("server sent data", data);
    return { success: true, data: data.features as Feature[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
