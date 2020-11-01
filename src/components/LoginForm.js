import React, { Component, Fragment } from 'react'
import { Container, Form, Segment, Input, Button } from 'semantic-ui-react'
import { Link } from 'wouter'

class LoginForm extends Component {
  render() {
    const { handleLogin } = this.props

    return (
      <Fragment>
        <Container>
          <Form onSubmit={handleLogin}>
            <Segment stacked>
              <Form.Field>
                <Input
                  icon="users"
                  iconPosition="left"
                  type="text"
                  name="username"
                  placeholder="Username"
                  onChange={(e) => this.setState({ username: e.target.value })}
                />
              </Form.Field>
              <Form.Field>
                <Input
                  icon="lock"
                  iconPosition="left"
                  type="password"
                  name="password"
                  placeholder="Password"
                  onChange={(e) => this.setState({ password: e.target.value })}
                />
              </Form.Field>
              <Button>Login</Button>
            </Segment>

            <div className="ui error message" />
          </Form>
        </Container>
      </Fragment>
    )
  }
}

export default LoginForm
