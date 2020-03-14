import React, { useState, useEffect } from 'react'
import { Auth } from 'aws-amplify'
import {
  IAuthContext,
  ILoginCredentials,
  ISignupCredentials,
  IResetPassword,
} from './types'

const AuthContext = React.createContext<IAuthContext>({
  isLoggedIn: false,
  login: () => Promise.resolve(),
  signOut: () => Promise.resolve(),
  signUp: (_: ILoginCredentials) => Promise.resolve(),
  confirmSignUp: (_: ISignupCredentials) => Promise.resolve(),
  forgotPassword: (_: string) => Promise.resolve(),
  resetPassword: (_: IResetPassword) => Promise.resolve(),
  getAWSCredentials: (_: any) => Promise.resolve(),
  getCurrentUser: () => Promise.resolve(null),
  getToken: () => Promise.resolve(''),
})

const AuthProvider: React.FC = ({ children }) => {
  const [isLoggedIn, setLogin] = useState<boolean | null>(null)

  useEffect(() => {
    getCurrentUser().then(user => {
      if (user) {
        setLogin(true)
      } else {
        setLogin(false)
      }
    })
  }, [])

  const signUp = async (credentials: ILoginCredentials) => {
    try {
      return Auth.signUp(credentials)
    } catch (e) {
      throw e
    }
  }

  const confirmSignUp = async (values: ISignupCredentials) => {
    const { code, ...credentials } = values
    try {
      await Auth.confirmSignUp(credentials.username, code!)
      await login(credentials)
      return true
    } catch (e) {
      throw e
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      await Auth.forgotPassword(email)
      return true
    } catch (e) {
      throw e
    }
  }

  const resetPassword = async (params: IResetPassword) => {
    try {
      await Auth.forgotPasswordSubmit(
        params.username,
        params.code,
        params.newPassword
      )
      return true
    } catch (e) {
      return false
    }
  }

  const login = async (credentials: ILoginCredentials) => {
    try {
      await Auth.signIn(credentials)
      setLogin(true)
      getCurrentUser()
      return true
    } catch (e) {
      setLogin(false)
      throw e
    }
  }

  const getCurrentUser = async () => {
    try {
      const user = await Auth.currentUserCredentials()
      return user
    } catch (e) {
      console.log('err', e)
      return null
    }
  }

  const getToken = async () => {
    try {
      // if user pool
      const creds = await Auth.currentSession()
      return creds.getIdToken().getJwtToken()
    } catch (e) {
      // if federated identity
      const token = JSON.parse(
        localStorage.getItem('aws-amplify-federatedInfo') || '{}'
      )?.token
      return token ?? ''
    }
  }

  const getAWSCredentials = async (googleUser: any) => {
    try {
      const { id_token, expires_at } = googleUser.getAuthResponse()
      const profile = googleUser.getBasicProfile()
      let user = {
        email: profile.getEmail(),
        name: profile.getName(),
      }

      await Auth.federatedSignIn(
        'google',
        { token: id_token, expires_at },
        user
      )
      setLogin(true)
      return true
    } catch (e) {
      throw e
    }
  }

  const signOut = async () => {
    try {
      await Auth.signOut()
      setLogin(false)
      return true
    } catch (e) {
      setLogin(true)
      throw e
    }
  }

  return (
    <AuthContext.Provider
      value={{
        signUp,
        confirmSignUp,
        login,
        forgotPassword,
        resetPassword,
        isLoggedIn,
        getAWSCredentials,
        getCurrentUser,
        signOut,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

const useAuth = () => React.useContext(AuthContext)

export { AuthProvider, useAuth }
