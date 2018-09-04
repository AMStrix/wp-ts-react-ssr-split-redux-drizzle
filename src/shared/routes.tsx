import loadable from 'loadable-components';

export const Home = loadable(() => import('./pages/Home'));
export const Features = loadable(() => import('./pages/Features'));
export const MetaCoin = loadable(() => import('./pages/MetaCoin'));

interface Route {
  disp: string;
  icon: string;
  exact: boolean;
  component: any;
  path: string;
}

interface RouteMap {
  [key: string]: Route;
}

const routes: Route[] = [
  {
    disp: 'Home',
    icon: 'home',
    path: '/',
    exact: true,
    component: Home,
  },
  {
    disp: 'Features',
    icon: 'dashboard',
    path: '/features',
    exact: false,
    component: Features,
  },
  {
    disp: 'MetaCoin',
    icon: 'copyright',
    path: '/metacoin',
    exact: false,
    component: MetaCoin,
  },
];

export const byPath: RouteMap = routes.reduce(
  (a: RouteMap, r: Route) => (a[r.path] = r) && a,
  {},
);

export default routes;
