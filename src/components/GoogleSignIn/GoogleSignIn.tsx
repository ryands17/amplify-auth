import React, { useEffect } from 'react'
import styles from './GoogleSignIn.module.css'
import { useAuth } from 'config/auth'

const GoogleSignIn: React.FC = () => {
  const { getAWSCredentials } = useAuth()

  async function signIn() {
    const ga = window.gapi?.auth2?.getAuthInstance()
    try {
      const googleUser = await ga.signIn()
      await getAWSCredentials(googleUser)
    } catch (e) {
      console.log('gsign error', e)
    }
  }

  useEffect(() => {
    const ga = window.gapi?.auth2 ? window.gapi?.auth2?.getAuthInstance() : null
    if (!ga) createScript()
  }, [])

  return (
    <div className={styles.googleBtn} role="button" onClick={signIn}>
      <div className={styles.googleIconWrapper}>
        <img
          className={styles.googleIcon}
          src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
          alt="Sign in with Google"
        />
      </div>
      <p className={styles.btnText}>
        <b>Sign in with Google</b>
      </p>
    </div>
  )
}

export default GoogleSignIn

function createScript() {
  // load the Google SDK
  const script = document.createElement('script')
  script.src = 'https://apis.google.com/js/platform.js'
  script.async = true
  script.onload = initGapi
  document.body.appendChild(script)
}

function initGapi() {
  // init the Google SDK client
  const g = window.gapi
  g.load('auth2', () => {
    g.auth2.init({
      client_id: 'your-app-client-id-here',
      // authorized scopes
      scope: 'profile email openid',
    })
  })
}
