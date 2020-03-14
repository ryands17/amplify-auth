import Amplify, { Auth } from 'aws-amplify'

export const amplifyConfig = {
  Auth: {
    region: 'enter-cognito-region-here',
    mandatorySignIn: true,
    userPoolId: 'user-pool-id',
    userPoolWebClientId: 'app-client-id',
    identityPoolId: 'identity-pool-id',
  },
}

Amplify.configure(amplifyConfig)

Auth.configure({
  ...amplifyConfig.Auth,
})
