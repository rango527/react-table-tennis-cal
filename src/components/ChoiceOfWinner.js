import React, { Component } from 'react'
import { Form, Checkbox, Icon } from 'semantic-ui-react'

export default class CheckboxExampleRadioGroup extends Component {
  state = {}
  handleChange = (e, { value }) => this.setState({ value })

  render() {
    const { index, i } = this.props
    return (
      <Form>
        {/* <Form.Field>
          Selected value: <b>{this.state.value}</b>
        </Form.Field> */}
        <Form.Field>
          <Icon
            // loading
            // size={index > i ? 'small' : 'large'}
            name={index > i ? 'pointing up' : 'pointing left'}
            value="expected"
            checked={this.state.value === 'expected'}
            onChange={this.handleChange}
          />
        </Form.Field>
        {/* <Form.Field>
          <Icon
            // loading
            size={i > index ? 'small' : 'large'}
            name="pointing left"
            value="underdog"
            checked={this.state.value === 'underdog'}
            onChange={this.handleChange}
          />
        </Form.Field> */}
      </Form>
    )
  }
}
