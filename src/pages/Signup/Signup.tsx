import React, { useState, useEffect, useRef } from 'react'
import { Card, Form, Input, Icon, Button, message } from 'antd'
import { FormComponentProps } from 'antd/lib/form'
import styles from './Signup.module.css'
import { useHistory } from 'react-router-dom'
import { routes } from 'config/routes'
import { ISignupCredentials } from 'config/types'
import { useAuth } from 'config/auth'

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

const Signup: React.FC<FormComponentProps<ISignupCredentials>> = ({ form }) => {
  const { getFieldDecorator } = form
  const history = useHistory()
  const { signUp, confirmSignUp } = useAuth()

  const [isLoading, setLoading] = useState(false)
  const [isVerificationCodeShown, showVerificationCode] = useState(false)

  const isMounted = useRef(false)
  const verificationCodeInput = useRef<Input>(null)

  useEffect(() => {
    isMounted.current = true
    return () => {
      isMounted.current = false
    }
  }, [])

  useEffect(() => {
    if (isVerificationCodeShown) {
      verificationCodeInput?.current?.focus()
    }
  }, [isVerificationCodeShown])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    form.validateFields(async (err, values) => {
      if (err) {
        return
      }
      try {
        isMounted.current && setLoading(true)
        if (!isVerificationCodeShown) {
          const user = await signUp(values)
          message.success(
            `An verification code has been sent to the email: ${user.codeDeliveryDetails.Destination}`,
            6
          )
          isMounted.current && showVerificationCode(true)
        } else {
          await confirmSignUp(values)
          history.push(routes.users.routePath())
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
        <h2>Signup</h2>
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
                readOnly={isVerificationCodeShown}
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
                readOnly={isVerificationCodeShown}
              />
            )}
          </Form.Item>

          {isVerificationCodeShown && (
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
          )}

          <Form.Item {...tailFormItemLayout}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              disabled={isLoading}
            >
              {isVerificationCodeShown ? 'Verify' : 'Register'}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}

export default Form.create({
  name: 'signup_form',
})(Signup)
