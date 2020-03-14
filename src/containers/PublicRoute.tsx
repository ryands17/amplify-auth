import React from 'react'
import { Route, Redirect, RouteProps } from 'react-router-dom'
import { useAuth } from 'config/auth'

export const PublicRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isLoggedIn } = useAuth()

  if (isLoggedIn === null) return <div></div>

  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: location },
            }}
          />
        )
      }
    />
  )
}
