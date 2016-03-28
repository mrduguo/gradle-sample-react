package com.github.mrduguo.gradle.samplereact.browser

import com.github.mrduguo.gradle.samplereact.browser.pages.HomePage
import com.github.mrduguo.gradle.samplereact.browser.pages.LoginPage
import com.github.mrduguo.gradle.samplereact.geb.AbstractBrowserSpec
import spock.lang.Stepwise

@Stepwise
class LoginSpec extends AbstractBrowserSpec {

    void "visit homepage without login should redirect to login page"() {
        when:
        notLoggedIn()
        via HomePage
        waitFor { title == 'Login Page' }

        then:
        at LoginPage
    }

    void "login with test user"() {
        when:
        def loginPage = page(LoginPage)
        loginPage.setUsernameAndPassword('user', 'pass')
        loginPage.loginButton.click()

        then:
        at HomePage
    }

    void "logout test user"() {
        when:
        page(HomePage).logoutButton.click()

        then:
        at LoginPage
    }


}