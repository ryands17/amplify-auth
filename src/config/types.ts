import React from 'react'
import { Route } from 'react-router-dom'
import { ICredentials } from '@aws-amplify/core'

export type ILoginCredentials = {
  username: string
  password: string
}

export type ISignupCredentials = {
  username: string
  password: string
  code?: string
}

export type IResetPassword = {
  username: string
  code: string
  newPassword: string
}

export type IAuthContext = {
  isLoggedIn: boolean | null
  login: (credentials: ILoginCredentials) => Promise<any>
  signOut: () => Promise<any>
  signUp: (_: ILoginCredentials) => Promise<any>
  confirmSignUp: (values: ISignupCredentials) => Promise<any>
  forgotPassword: (email: string) => Promise<any>
  resetPassword: (params: IResetPassword) => Promise<any>
  getAWSCredentials: (_: any) => Promise<any>
  getCurrentUser: () => Promise<ICredentials | null>
  getToken: () => Promise<string>
}

export type IRoute = {
  path: string
  routePath: (args?: any) => string
  routeComponent: typeof Route | React.FC<any>
  component: any
  exact: boolean
}

// users
export interface User {
  id: number
  name: string
  username: string
  email: string
  address: Address
  phone: string
  website: string
  company: Company
}

interface Company {
  name: string
  catchPhrase: string
  bs: string
}

interface Address {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: Geo
}

interface Geo {
  lat: string
  lng: string
}
