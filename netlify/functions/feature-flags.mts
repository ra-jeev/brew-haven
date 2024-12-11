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
  targets: {
    _id: string;
    name: string;
    distribution: Distribution[];
    audience: {
      name: string;
      filters: {
        operator: "and" | "or";
        filters: { type: string }[];
      };
    };
  }[];
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

async function getFeatures(
  featuresUrl: string,
  headers: Record<string, string>,
) {
  const featuresResponse = await fetch(featuresUrl, { headers });

  if (!featuresResponse.ok) {
    throw new Error(`Failed to fetch flags: ${featuresResponse.status}`);
  }

  const featuresData = await featuresResponse.json();
  const configPromises = featuresData.map(async (feature: any) => {
    const configResponse = await fetch(
      `${featuresUrl}/${feature._id}/configurations?environment=development`,
      { headers },
    );

    if (!configResponse.ok) {
      console.error(`Failed to fetch config for feature ${feature._id}`);
      return null;
    }

    const configs: FeatureConfig[] = await configResponse.json();

    return {
      ...feature,
      targets: configs[0].targets,
      status: configs[0].status,
    };
  });

  const featuresWithConfigs = await Promise.all(configPromises);
  return featuresWithConfigs.filter((f) => f !== null);
}

async function updateFeature(
  featuresUrl: string,
  featureId: string,
  headers: Record<string, string>,
  update: any,
) {
  const response = await fetch(
    `${featuresUrl}/${featureId}/configurations?environment=development`,
    {
      method: "PATCH",
      headers,
      body: JSON.stringify(update),
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to update feature: ${response.status}`);
  }

  return await response.json();
}

export default async (req: Request) => {
  try {
    const { method } = req;
    const token = await getAuthToken();
    const featuresBaseUrl = `https://api.devcycle.com/v1/projects/${process.env.DEVCYCLE_PROJECT_ID}/features`;
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (method === "GET") {
      const features = await getFeatures(featuresBaseUrl, headers);

      return Response.json({ features });
    }

    if (method === "PATCH") {
      const body = await req.json();
      const { featureId, update } = body;

      const data = await updateFeature(
        featuresBaseUrl,
        featureId,
        {
          ...headers,
          "Content-Type": "application/json",
        },
        update,
      );

      return Response.json({ data });
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
