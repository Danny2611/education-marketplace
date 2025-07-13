export type NavigationPage = 'home' | 'favorites' | 'history';

export interface NavigationItem {
  id: NavigationPage;
  label: string;
  icon?: React.ReactNode;
  count?: number;
  href?: string;
}