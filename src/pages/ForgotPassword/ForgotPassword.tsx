import React, { useState, useEffect, useRef } from 'react'
import { Card, Form, Input, Icon, Button, message } from 'antd'
import { Link, useHistory } from 'react-router-dom'
import { FormComponentProps } from 'antd/lib/form'
import styles from './ForgotPassword.module.css'
import { routes } from 'config/routes'
import { useAuth } from 'config/auth'

type IForgotPasswordForm = {
  username: string
  code?: string
  password?: string
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

const ForgotPassword: React.FC<FormComponentProps<IForgotPasswordForm>> = ({
  form,
}) => {
  const { getFieldDecorator } = form
  const { forgotPassword, resetPassword } = useAuth()
  const history = useHistory()

  const [isLoading, setLoading] = useState(false)
  const [resetFields, showResetFields] = useState(false)

  const isMounted = useRef(false)
  const verificationCodeInput = useRef<Input>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (resetFields) {
      verificationCodeInput?.current?.focus()
    }
  }, [resetFields])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      try {
        isMounted.current && setLoading(true)
        if (!resetFields) {
          await forgotPassword(values.username)
          message.success(
            `An verification code has been sent to your email address`,
            4
          )
          isMounted.current && showResetFields(true)
        } else {
          await resetPassword({
            username: values.username,
            code: values.code!,
            newPassword: values.password!,
          })
          message.success('Password reset successfully!', 4)
          history.push(routes.login.routePath())
        }
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
        <h2>Forgot Password</h2>
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
                readOnly={resetFields}
              />
            )}
          </Form.Item>

          {resetFields && (
            <>
              <Form.Item label="Code">
                {getFieldDecorator('code', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter the verification code',
                    },
                  ],
                })(
                  <Input
                    prefix={<Icon type="number" className={styles.icon} />}
                    type="password"
                    placeholder="******"
                    ref={verificationCodeInput}
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
            </>
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {resetFields ? 'Reset' : 'Verify'}
            </Button>
            <Link to={routes.login.routePath()} style={{ marginLeft: 20 }}>
              Back to Login
            </Link>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Form.create({
  name: 'forgot_password',
})(ForgotPassword)
