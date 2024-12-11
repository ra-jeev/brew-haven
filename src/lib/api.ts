interface Distribution {
  _variation: string;
  percentage: number;
}

interface Audience {
  name: string;
  filters: {
    operator: "and" | "or";
    filters: { type: string }[];
  };
}

export interface Target {
  _id: string;
  name: string;
  distribution: Distribution[];
  audience: Audience;
}

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
  targets: Target[];
}

export async function getFeatureFlags() {
  try {
    const response = await fetch("/.netlify/functions/feature-flags");
    if (!response.ok) {
      throw new Error("Failed to fetch flags");
    }

    const data = await response.json();
    return { success: true, data: data.features as Feature[] };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
