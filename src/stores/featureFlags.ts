import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface FeatureFlags {
  // Menu related flags
  showSeasonalMenu: boolean;
  showNutritionInfo: boolean;
  enableCustomization: boolean;

  // Checkout related flags
  enableOnlinePayment: boolean;
  enableLoyaltyPoints: boolean;
  showEstimatedPickupTime: boolean;

  // UI/UX flags
  enableDarkMode: boolean;
  showPromotionalBanner: boolean;
  enableLiveOrderTracking: boolean;
}

interface FeatureFlagStore extends FeatureFlags {
  setFeatureFlag: (flag: keyof FeatureFlags, value: boolean) => void;
  resetFlags: () => void;
}

const defaultFlags: FeatureFlags = {
  showSeasonalMenu: false,
  showNutritionInfo: true,
  enableCustomization: true,
  enableOnlinePayment: true,
  enableLoyaltyPoints: false,
  showEstimatedPickupTime: true,
  enableDarkMode: false,
  showPromotionalBanner: true,
  enableLiveOrderTracking: false,
};

export const useFeatureFlags = create<FeatureFlagStore>()(
  persist(
    (set) => ({
      ...defaultFlags,
      setFeatureFlag: (flag, value) =>
        set((state) => ({ ...state, [flag]: value })),
      resetFlags: () => set(defaultFlags),
    }),
    {
      name: "coffee-shop-feature-flags",
    },
  ),
);
