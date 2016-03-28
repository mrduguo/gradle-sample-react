package com.github.mrduguo.gradle.samplereact.browser

import com.github.mrduguo.gradle.samplereact.browser.pages.HomePage
import com.github.mrduguo.gradle.samplereact.geb.AbstractBrowserSpec
import spock.lang.Shared
import spock.lang.Stepwise

@Stepwise
class CRUDSpec extends AbstractBrowserSpec {

    @Shared
    HomePage homePage
    @Shared
    def employee

    void "create entry"() {
        given:
        loggedInUser()

        when:
        homePage = page(HomePage)
        homePage.createLink.click()
        homePage.createForm.setFields(
                "test_create_first_name_${sessionId}",
                "test_create_last_name_${sessionId}",
                "test_create_description_${sessionId}"
        )
        homePage.createForm.submitButton.click()
        employee = homePage.employee("test_create_first_name_${sessionId}")

        then:
        employee.firstName == "test_create_first_name_${sessionId}"
        employee.lastName == "test_create_last_name_${sessionId}"
        employee.description == "test_create_description_${sessionId}"
    }

    void "retrieve entry"() {
        when:
        int currentPage = 1
        homePage.pageFirst.click()
        while (homePage.pageOnNumber(currentPage)) {
            employee = homePage.employeeNoWait("test_create_first_name_${sessionId}")
            if (employee) {
                break
            }
            homePage.pageNext.click()
            currentPage++
        }

        then:
        employee.description == "test_create_description_${sessionId}"
    }

    void "update entry"() {
        when:
        employee = homePage.employee("test_create_first_name_${sessionId}")
        employee.updateButton.click()
        employee.updateForm.setFields(
                "test_updated_first_name_${sessionId}",
                "test_updated_last_name_${sessionId}",
                "test_updated_description_${sessionId}"
        )
        employee.updateForm.submitButton.click()
        employee = homePage.employee("test_updated_first_name_${sessionId}")

        then:
        employee.firstName == "test_updated_first_name_${sessionId}"
        employee.lastName == "test_updated_last_name_${sessionId}"
        employee.description == "test_updated_description_${sessionId}"
    }

    void "delete entry"() {
        when:
        employee = homePage.employee("test_updated_first_name_${sessionId}")
        employee.deleteButton.click()

        then:
        waitFor { !homePage.employeeNoWait("test_updated_first_name_${sessionId}") }
    }


}