package com.github.mrduguo.gradle.samplereact.rest

import org.springframework.http.HttpStatus

class RestSpec extends AbstractSpec {

    void 'should return html page from homepage'() {
        when:
        def entity = getForEntity('/', String.class)

        then:
        entity.statusCode == HttpStatus.OK
        entity.getHeaders().getContentType().toString() == 'text/html;charset=UTF-8'
    }

}