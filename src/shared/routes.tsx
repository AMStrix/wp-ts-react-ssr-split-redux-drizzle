import loadable from 'loadable-components';

export const Home = loadable(() => import('./pages/Home'));
export const Status = loadable(() => import('./pages/Status'));

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
    disp: 'Status',
    icon: 'dashboard',
    path: '/status',
    exact: false,
    component: Status,
  },
];

export const byPath: RouteMap = routes.reduce(
  (a: RouteMap, r: Route) => (a[r.path] = r) && a,
  {},
);

export default routes;
