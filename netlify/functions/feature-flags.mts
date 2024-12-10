interface AuthToken {
  access_token: string;
  expires_in: number;
  token_type: string;
}

interface Distribution {
  _variation: string;
  percentage: number;
}

interface FeatureConfig {
  _feature: string;
  _environment: string;
  status: string;
  targets: Array<{
    _id: string;
    name: string;
    distribution: Distribution[];
  }>;
}

let tokenCache: { token: string; expiresAt: number } | null = null;

async function getAuthToken() {
  if (tokenCache && tokenCache.expiresAt > Date.now()) {
    return tokenCache.token;
  }

  try {
    const response = await fetch("https://auth.devcycle.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "client_credentials",
        audience: "https://api.devcycle.com/",
        client_id: process.env.DEVCYCLE_API_CLIENT_ID!,
        client_secret: process.env.DEVCYCLE_API_CLIENT_SECRET!,
      }),
    });

    if (!response.ok) {
      throw new Error(`Auth failed: ${response.status}`);
    }

    const data: AuthToken = await response.json();

    tokenCache = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000 - 5 * 60 * 1000,
    };

    return data.access_token;
  } catch (error) {
    console.error("Failed to get auth token:", error);
    throw error;
  }
}

export default async (req: Request) => {
  try {
    const token = await getAuthToken();
    const { method } = req;

    if (method === "GET") {
      const featuresResponse = await fetch(
        `https://api.devcycle.com/v1/projects/${process.env.DEVCYCLE_PROJECT_ID}/features`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!featuresResponse.ok) {
        throw new Error(`Failed to fetch flags: ${featuresResponse.status}`);
      }

      const featuresData = await featuresResponse.json();
      const configPromises = featuresData.map(async (feature: any) => {
        const configResponse = await fetch(
          `https://api.devcycle.com/v1/projects/${process.env.DEVCYCLE_PROJECT_ID}/features/${feature._id}/configurations`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!configResponse.ok) {
          console.error(`Failed to fetch config for feature ${feature._id}`);
          return null;
        }

        const configs: FeatureConfig[] = await configResponse.json();
        const activeConfig = configs.find((c) => c.status === "active");

        return {
          ...feature,
          currentVariation:
            feature.type === "release"
              ? activeConfig?.targets?.[0]?.distribution?.[0]?._variation
              : undefined,
          distributions:
            feature.type === "experiment"
              ? activeConfig?.targets?.[0]?.distribution
              : undefined,
          status: activeConfig?.status ?? "inactive",
        };
      });

      const featuresWithConfigs = await Promise.all(configPromises);
      const validFeatures = featuresWithConfigs.filter((f) => f !== null);

      return Response.json({ features: validFeatures });
    }

    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Internal server error",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
};
