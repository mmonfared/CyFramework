Feature: Check todos and verifying them to be checked
    Scenario: Check first todo
        Given I open the Todo page app
        When I check the todo checkbox with index 0
        Then Verify checkbox with index 0 to be chechked
        And Verify remaining text to match "4 of 5 remainingg"
