import { lazy } from 'react'
import { PublicRoute } from 'containers/PublicRoute'
import { PrivateRoute } from 'containers/PrivateRoute'
import { createConfig } from 'config/helpers'
import { IRoute } from './types'

export const routes = createConfig<IRoute>()({
  login: {
    path: '/login',
    routePath: () => '/login',
    routeComponent: PublicRoute,
    component: lazy(() => import('pages/Login/Login')),
    exact: true,
  },
  forgotPassword: {
    path: '/password-reset',
    routePath: () => '/password-reset',
    routeComponent: PublicRoute,
    component: lazy(() => import('pages/ForgotPassword/ForgotPassword')),
    exact: true,
  },
  signup: {
    path: '/signup',
    routePath: () => '/signup',
    routeComponent: PublicRoute,
    component: lazy(() => import('pages/Signup/Signup')),
    exact: true,
  },
  users: {
    path: '/',
    routePath: () => '/',
    routeComponent: PrivateRoute,
    component: lazy(() => import('pages/Users/Users')),
    exact: true,
  },
})

export const renderRoutes = Object.entries(routes)
