jest.autoMockOff()

var React = require('react')
var TestUtils = require('react-addons-test-utils')
const Footer = require('../footer').default

describe('Footer', function () {
  it('footer copyright should contain current year', function () {
    const rendered = TestUtils.renderIntoDocument(<Footer />)
    var element = TestUtils.findRenderedDOMComponentWithClass(rendered, 'footer')

    expect(element).toBeDefined()
    expect(element.textContent).toBe('© ACME ' + (new Date()).getFullYear())
  })
})
