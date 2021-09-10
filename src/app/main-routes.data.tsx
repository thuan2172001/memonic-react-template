import {MenuItemModel} from './layout/components/aside/aside-menu/menu-item-model';
import React, {lazy} from 'react';

const HomePage = lazy(() => import('./pages/_homepage'))
const UserPage = lazy(() => import('./pages/user/user'))

export const MainRoutes: MenuItemModel[] = [
  // {parent: true, title: 'MENU.DASHBOARD', url: '/dashboard', component: HomePage},
  {parent: true, title: 'MENU.USER_MANAGEMENT', url: '/user-management', component: HomePage},
  {parent: true, title: 'MENU.PROVIDER_MANAGEMENT', url: '/provider-management', component: HomePage},
  {parent: true, title: 'MENU.SERVICE_MANAGEMENT', url: '/service-management', component: HomePage},
  {parent: true, title: 'MENU.ACTIVITY_LOG', url: '/activity-log', component: HomePage},
  {parent: true, title: 'MENU.ADMIN_MANAGEMENT', url: '/admin-management', component: HomePage},
];
