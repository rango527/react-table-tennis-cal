import React, { Component, Fragment } from 'react'
import { Container, Form } from 'semantic-ui-react'

class LoginForm extends Component {
  render() {
    return (
      <Fragment>
        <Container>
          <Form onSubmit={this.props.handleLogin}>
            <div className="ui stacked segment">
              <div className="field">
                <div className="ui left icon input">
                  <i className="user icon" />
                  <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    onChange={(e) =>
                      this.setState({ username: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="field">
                <div className="ui left icon input">
                  <i className="lock icon" />
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    onChange={(e) =>
                      this.setState({ password: e.target.value })
                    }
                  />
                </div>
              </div>
              <button className="ui huge primary button">Login</button>
            </div>

            <div className="ui error message" />
          </Form>
        </Container>
      </Fragment>
    )
  }
}

export default LoginForm
