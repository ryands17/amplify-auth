import React from 'react'
import { useHistory } from 'react-router-dom'
import { Button, message } from 'antd'
import { routes } from 'config/routes'
import { useAuth } from 'config/auth'

const Users: React.FC = () => {
  const history = useHistory()
  const { signOut } = useAuth()

  const signout = async () => {
    try {
      await signOut()
      history.push(routes.login.routePath())
    } catch (e) {
      message.error(e.message)
    }
  }

  return (
    <div>
      <h1>Authenticated Successfully</h1>
      <p>You are now logged in!</p>
      <Button type="primary" onClick={signout}>
        Sign Out
      </Button>
    </div>
  )
}

export default Users
