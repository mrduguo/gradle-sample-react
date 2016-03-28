package com.github.mrduguo.gradle.samplereact.browser.pages


class LoginPage extends geb.Page {
    static url = 'login'

    static at = { title == 'Login Page' }

    static content = {
        username { $('input[name="username"]') }
        password { $('input[name="password"]') }
        loginButton(to: HomePage, toWait: true) { $('input[name="submit"]') }
    }


    void setUsernameAndPassword(String user, String pass) {
        username.value(user)
        password.value(pass)
    }
}