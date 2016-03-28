/*eslint-disable no-undef*/
import SockJS from 'sockjs-client'
import 'stompjs'

export default {
  register: function (registrations) {
    const socket = SockJS('/payroll')
    const stompClient = Stomp.over(socket)
    stompClient.connect({}, function (frame) {
      registrations.forEach(function (registration) {
        stompClient.subscribe(registration.route, registration.callback)
      })
    })
  }
}
