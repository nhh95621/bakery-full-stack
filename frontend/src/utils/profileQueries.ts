export function shouldLoadProtectedProfileData(authLoading: boolean, hasAuthenticatedUser: boolean) {
  return !authLoading && hasAuthenticatedUser;
}

export type ProfileTabId = "orders" | "reviews" | "favorites";

type ProfileRefetchers = {
  orders: () => unknown;
  reviews: () => unknown;
  favorites: () => unknown;
};

export function retryProtectedProfileTab(activeTab: ProfileTabId, refetchers: ProfileRefetchers) {
  return refetchers[activeTab]();
}
