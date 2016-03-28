package com.github.mrduguo.gradle.samplereact.browser.pages

import geb.Module

import java.util.regex.Pattern


class HomePage extends geb.Page {
    static url = ''

    static at = {
        createLink
        $('h3').text().matches(/.*Page \d+ of \d+.*/)
    }

    static content = {
        logoutButton(to: LoginPage, toWait: true) { $('input[value="Log Out"]') }
        createLink { $('a[href="#createEmployee"]') }
        createForm(wait: true) { $('#createEmployee form').module(FormModule) }
        employee(wait: true) { firstName -> $('tr').has('td', text: firstName).module(EmployeeModule) }
        employeeNoWait(required: false) { firstName -> $('tr').has('td', text: firstName) }
        pageFirst { $('button', text: '<<') }
        pageNext { $('button', text: '>') }
        pageOnNumber(wait: true) { expectedNumber -> $('h3').text().matches(Pattern.compile(".*Page $expectedNumber of \\d+.*")) }
    }
}

class FormModule extends Module {
    static content = {
        firstName(wait: true) { $('input[name="firstName"]') }
        lastName { $('input[name="lastName"]') }
        description { $('input[name="description"]') }
        submitButton { $('button') }
    }

    void setFields(String _firstName, String _lastName, String _description) {
        firstName.value(_firstName)
        lastName.value(_lastName)
        description.value(_description)
    }
}

class EmployeeModule extends Module {
    static content = {
        firstName { $('td', 0).text() }
        lastName { $('td', 1).text() }
        description { $('td', 2).text() }
        updateButton { find('a', text: 'Update') }
        updateForm(wait: true) { $('form').module(FormModule) }
        deleteButton { $('button', text: 'Delete') }
    }
}