import { useVariableValue } from "@devcycle/react-client-sdk";
import { featureKeys } from "@/lib/consts";

export function useFeatureFlags() {
  const showSeasonalMenu = useVariableValue(
    featureKeys.SHOW_SEASONAL_MENU,
    false,
  );
  const showNutritionInfo = useVariableValue(
    featureKeys.SHOW_NUTRITION_INFO,
    false,
  );
  const enableMenuCustomization = useVariableValue(
    featureKeys.ENABLE_MENU_CUSTOMIZATION,
    false,
  );

  const enableOnlinePayment = useVariableValue(
    featureKeys.ENABLE_ONLINE_PAYMENT,
    false,
  );
  const enableLoyaltyPoints = useVariableValue(
    featureKeys.ENABLE_LOYALTY_POINTS,
    false,
  );
  const enableLiveOrderTracking = useVariableValue(
    featureKeys.ENABLE_LIVE_ORDER_TRACKING,
    false,
  );

  const showPromotionalBanner = useVariableValue(
    featureKeys.SHOW_PROMOTIONAL_BANNER,
    "",
  );
  const promotionDiscount = useVariableValue(featureKeys.PROMOTION_DISCOUNT, 0);
  const promotionDiscountType = useVariableValue(
    featureKeys.PROMOTION_DISCOUNT_TYPE,
    "none",
  );
  const promotionMinCartValue = useVariableValue(
    featureKeys.PROMOTION_DISCOUNT_MIN_CART,
    0,
  );

  return {
    showSeasonalMenu,
    showNutritionInfo,
    enableMenuCustomization,
    enableOnlinePayment,
    enableLoyaltyPoints,
    enableLiveOrderTracking,
    showPromotionalBanner,
    promotionDiscountType,
    promotionDiscount,
    promotionMinCartValue,
  };
}
