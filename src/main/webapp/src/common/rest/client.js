import rest from 'rest'
import defaultRequest from 'rest/interceptor/defaultRequest'
import mime from 'rest/interceptor/mime'
import uriTemplateInterceptor from './uri-template-interceptor'
import unauthorizedInterceptor from './rest-unauthorized-interceptor'
import errorCode from 'rest/interceptor/errorCode'
import baseRegistry from 'rest/mime/registry'

const registry = baseRegistry.child()
registry.register('text/uri-list', require('./uri-list-converter'))
registry.register('application/hal+json', require('rest/mime/type/application/hal'))

export default rest
  .wrap(mime, {registry: registry})
  .wrap(unauthorizedInterceptor)
  .wrap(uriTemplateInterceptor)
  .wrap(errorCode)
  .wrap(defaultRequest, {headers: {'Accept': 'application/hal+json', 'X-Requested-With': 'XMLHttpRequest'}})
