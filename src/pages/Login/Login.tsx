import React, { useState, useEffect, useRef } from 'react'
import { Card, Form, Input, Icon, Button, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import styles from './Login.module.css'
import { routes } from 'config/routes'
import { useAuth } from 'config/auth'
import GoogleSignIn from 'components/GoogleSignIn/GoogleSignIn'

type ILoginForm = {
  username: string
  password: string
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
}

const Login: React.FC<FormComponentProps<ILoginForm>> = ({ form }) => {
  const { getFieldDecorator } = form
  const { login } = useAuth()
  const history = useHistory()

  const [isLoading, setLoading] = useState(false)
  const isMounted = useRef(false)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      try {
        isMounted.current && setLoading(true)
        await login(values)
        history.push(routes.users.routePath())
      } catch (e) {
        message.error(e.message, 4)
      } finally {
        isMounted.current && setLoading(false)
      }
    })
  }

  return (
    <div className={styles.wrapper}>
      <Card className={styles.card}>
        <h2>Login</h2>
        <Form {...formItemLayout} onSubmit={handleSubmit}>
          <Form.Item label="Email">
            {getFieldDecorator('username', {
              rules: [
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                { required: true, message: 'Please enter an email' },
              ],
            })(
              <Input
                prefix={
                  <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                }
                placeholder="abc@example.com"
              />
            )}
          </Form.Item>

          <Form.Item label="Password">
            {getFieldDecorator('password', {
              rules: [
                { required: true, message: 'Please enter your password' },
                {
                  min: 8,
                  message: 'Password should be min. 8 chars long',
                },
              ],
            })(
              <Input
                prefix={<Icon type="lock" className={styles.icon} />}
                type="password"
                placeholder="********"
              />
            )}
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              Login
            </Button>
            <Link
              to={routes.forgotPassword.routePath()}
              style={{ marginLeft: 20 }}
            >
              Forgot Password
            </Link>
          </Form.Item>

          <Form.Item {...tailFormItemLayout}>
            <h3>OR</h3>
            <GoogleSignIn />
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Form.create({
  name: 'login',
})(Login)
