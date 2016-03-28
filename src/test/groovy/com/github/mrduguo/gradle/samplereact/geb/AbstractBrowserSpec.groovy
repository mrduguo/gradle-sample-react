package com.github.mrduguo.gradle.samplereact.geb

import geb.Configuration
import geb.spock.GebReportingSpec
import com.github.mrduguo.gradle.samplereact.Application
import com.github.mrduguo.gradle.samplereact.browser.pages.LoginPage
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.test.SpringApplicationConfiguration
import org.springframework.boot.test.WebIntegrationTest
import org.springframework.context.ApplicationContext
import spock.lang.Shared

import java.lang.management.ManagementFactory

@SpringApplicationConfiguration(classes = Application.class)
@WebIntegrationTest
class AbstractBrowserSpec extends GebReportingSpec {

    @Value('${local.server.port}')
    int port=8881

    @Shared
    String sessionId = testSessionId()

    @Autowired
    ApplicationContext context

    String url(String path){
        "http://localhost:${port}$path"
    }

    @Override
    Configuration createConf() {
        def conf = super.createConf()
        conf.setReportsDir(new File('build/reports/geb'))
        if(System.properties.GEB_FIREFOX_DRIVER=='true'){
            // default is firefox
        }else{
            conf.driver=PhantomJSInstaller.usePhantomJS()
        }
        return conf
    }

    void loggedInUser() {
        if(!$('input[value="Log Out"]')){
            config.setBaseUrl(url('/'))
            def loginPage=to(LoginPage)
            loginPage.setUsernameAndPassword('user','pass')
            loginPage.loginButton.click()
        }
    }

    void notLoggedIn() {
        config.setBaseUrl(url('/'))
        browser.clearCookies()
    }

    String testSessionId() {
        ManagementFactory.runtimeMXBean.startTime
    }

}