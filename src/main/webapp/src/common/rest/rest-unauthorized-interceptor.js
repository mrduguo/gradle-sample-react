import interceptor from 'rest/interceptor'

export default interceptor({
  response: function (response, config, client) {
    if (response.status.code === 401) {
      window.location.href = '/login'
    } else {
      return response
    }
  }
})
