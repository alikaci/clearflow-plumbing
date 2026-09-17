import { features } from "@/config/features";
import type { FlagName, NavigationItem } from "@/types";

export function isFeatureEnabled(flag?: FlagName): boolean {
  return flag === undefined ? true : features[flag];
}

export function filterNavigation(
  items: readonly NavigationItem[],
): NavigationItem[] {
  return items.filter((item) => isFeatureEnabled(item.flag));
}
