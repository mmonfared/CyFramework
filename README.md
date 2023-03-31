# Cypress Framework Boilerplate 
## By **Mohammad Monfared** | [LinkedIn](https://www.linkedin.com/in/mohammad-monfared) | [YouTube](https://www.youtube.com/automationcamp) | [Website](http://www.monfared.io/)
## Workshop Record: [YouTube Video](https://www.youtube.com/watch?v=9o7LZRmj2zc)
---
## Description:
We have a simple ToDo application deployed in different environments:

Dev Environment: http://devtodo.monfared.io/

Stag Environment: http://stagtodo.monfared.io/

Using Cypress, we will create a test automation framework with the following features:

- The Page Object Model is a pattern
- BDD (Cucumber) support
- Multi-environment and multi-browser testing support
- Create reports that include videos and screenshots
- Test results dashboard with options to compare, analyze history, and generate graphs.
- CI integration

As an example, the following are two requirements (Acceptance Criteria) that we will write tests for. 

`AC1`
```gherkin
Scenario: Add todo
    Given I open the Todo page app
    When I add a todo with text "New Todo"
    Then Verify last todo to match "New Todo"
    And Verify remaining text to match "6 of 6 remaining"
```

`AC2`
```gherkin
Scenario: Check first todo
    Given I open the Todo page app
    When I check the todo checkbox with index 0
    Then Verify checkbox with index 0 to be chechked
    And Verify remaining text to match "4 of 5 remaining"
```
## 🚀 Lets get started...

## 🟩 PART 1️⃣

## 1. Create an empty repo in VCS (e.g. GitHub) and clone
## 2. Initialize node project and install cypress

```
npm init -y
npm install cypress --save-dev
npx cypress open
```

## 3. Add BDD support (Gherkin syntax)

### Install

```
npm install cypress-cucumber-preprocessor --save-dev
```

### add to config

`cypress.config.js`

```javascript
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('file:preprocessor', cucumber())
    },
    specPattern: '**/features/*.{feature,features}',
    excludeSpecPattern: '**/pages/*',
  },
})
```

### configure the cypress-cucumber-preprocessor to using global step definitions

`package.json`

```javascript
"cypress-cucumber-preprocessor": {
    "step_definitions": "cypress/support/step_definitions/",
    "nonGlobalStepDefinitions": false
  }
```

## 4. Create Page Objects

`e2e/pages/todoPage/elements.js`

```javascript
module.exports = {
    TODOPAGE:{
        REMAINING_TEXT: ".ng-binding",
        CHECKBOX: "input[type=checkbox]",
        CHECKBOX_TEXT: "li>span",
        NEW_TODO_FIELD: "#sampletodotext",
        ADD_BUTTON: "#addbutton"
    }
}
```

`e2e/pages/todoPage/todoPage.js`

```javascript
var elements = require('./elements')

class TodoPage {
  typeInNewTodoField(value) {
    return cy.get(elements.TODOPAGE.NEW_TODO_FIELD).type(value)
  }

  clickAddButton() {
    return cy.get(elements.TODOPAGE.ADD_BUTTON).click()
  }

  getRemainingText() {
    return cy.get(elements.TODOPAGE.REMAINING_TEXT).invoke('text')
  }

  clickOnCheckBox(index) {
    return cy.get(elements.TODOPAGE.CHECKBOX).eq(index).check()
  }

  getCheckboxText(index) {
    return cy.get(elements.TODOPAGE.CHECKBOX_TEXT).eq(index).invoke('text')
  }

  verifyCheckboxToBeChecked(index) {
    return cy.get(elements.TODOPAGE.CHECKBOX).eq(index).should("be.checked")
  }

  getLastTodoText() {
    return cy.get(elements.TODOPAGE.CHECKBOX_TEXT).last().invoke('text')
  }

  }
  export default TodoPage
```

## 5. Add Step Definitions

`cypress/support/step_definitions/steps.js`

```javascript
import { Given, When, Then } from 'cypress-cucumber-preprocessor/steps'

import TodoPage from '../../e2e/pages/todoPage/todoPage'

const todoPage = new TodoPage()

Given('I open the Todo page app', () => {
    // cy.visit('/')
    cy.visit('http://stagtodo.monfared.io/')
    cy.contains('Environment Todo')
  })

When(
    'I add a todo with text {string}',
    (query) => {
      todoPage.typeInNewTodoField(query)
      todoPage.clickAddButton(query)
    }
  )

When(
    'I check the todo checkbox with index {int}',
    (index) => {
      todoPage.clickOnCheckBox(index)
    }
  )

Then(
    'Verify last todo to match {string}', (value) => {
      todoPage.getLastTodoText().then((text) => {
        expect(text).to.include(value)
      })
    }
  )

Then('Verify remaining text to match {string}', (value) => {
  todoPage.getRemainingText().then((text) => {
    expect(text).to.include(value)
  })

})

Then('Verify checkbox with index {} to be chechked', (index) => {
  todoPage.verifyCheckboxToBeChecked(index)
})
```

## 6. Add feature files

`e2e/features/AddTodo.feature`

```gherkin
Feature: Add todo and verifying it to be added
    Scenario: Add todo
        Given I open the Todo page app
        When I add a todo with text "New Todo"
        Then Verify last todo to match "New Todo"
        And Verify remaining text to match "6 of 6 remaining"
```

`e2e/features/CheckTodo.feature`

```gherkin
Feature: Check todos and verifying them to be checked
    Scenario: Check first todo
        Given I open the Todo page app
        When I check the todo checkbox with index 0
        Then Verify checkbox with index 0 to be chechked
        And Verify remaining text to match "4 of 5 remaining"
```
## 7. Add IDE plugin for `.feature` files

## 🟩 PART 2️⃣

## 8. Run aginst Multiple Environments / Browsers

### add scripts to package.json

`package.json`

```json
"scripts": {
    "cy:dev:chrome": "cypress run --config baseUrl=http://devtodo.monfared.io/ --browser chrome --record",
    "cy:stag:chrome": "cypress run --config baseUrl=http://stagtodo.monfared.io/ --browser chrome --record",
    "cy:dev:firefox": "cypress run --config baseUrl=http://devtodo.monfared.io/ --browser firefox --record",
    "cy:stag:firefox": "cypress run --config baseUrl=http://stagtodo.monfared.io/ --browser firefox --record",
    "cy:headed": "cypress run --config baseUrl=http://devtodo.monfared.io/ --headed",
    "cy:test": "cypress run --config baseUrl=http://devtodo.monfared.io/"
  }
```

### change hardcoded urls with baseUrl home (/)

```javascript
Given('I open the Todo page app', () => {
    cy.visit('/')
    // cy.visit('http://stagtodo.monfared.io/')
    cy.contains('Environment Todo')
  })
```

## 9. Define report folder

`cypress.config.js`

```javascript
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      ...
    },
    ...,
    videosFolder: "cypress/reports/videos",
    screenshotsFolder: "cypress/reports/screenshots",
  },
})
```

## 10. Add Mochawesome reporter

### Install

```
npm install cypress-mochawesome-reporter --save-dev
```

### add to config

`cypress.config.js`

```javascript
const cucumber = require('cypress-cucumber-preprocessor').default

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      ...,
      require('cypress-mochawesome-reporter/plugin')(on);
    },
    ...,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      charts: true,
      reportPageTitle: 'custom-title',
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
  },
})
```

### add to cypress/support/e2e.js

`e2e.js`

```javascript
import 'cypress-mochawesome-reporter/register';
```

## 11. Connect to Cypress Dashboard

### Create a user, an organization and a project

```
https://cloud.cypress.io/
```

### Add "projectId" to cypress config

```javascript
module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      ...
    },
    ...,
    projectId: "xxxxxx",
  },
})
```
## 🟩 PART 3️⃣

## 12. Integrate to CI (GitHub Actions as an example)

### Define **"CYPRESS_RECORD_KEY"** as a secret in GitHub repo → Settings → Secrets → Actions
```
"CYPRESS_RECORD_KEY" > From cypress dashboard
```

### Add workflow for cypress

<h4>create yaml config file (master branch)</h4> 

`.github/workflows/main.yml`

```yaml
name: Run tests against STAG and PROD environment
on:
  push:
    branches: [stag, master]

jobs:
  Test-on-Chrome:
    runs-on: ubuntu-latest
    steps:
        - name: Checkout GitCode
          uses: actions/checkout@v3.3.0

        - name: Install dependencies
          uses: cypress-io/github-action@v5.0.8
          with:
            runTests: false

        - name: Run Cypress Tests
          uses: cypress-io/github-action@v5.0.8
          with:
            record: true
            parallel: true
            command: "npm run cy:stag:chrome"
          env:
            CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        
        - name: Upload Videos to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-videos-chrome
            path: "${{ github.workspace }}/cypress/reports/videos/"
          
        - name: Upload Screenshots to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: failure()
          with:
            name: cypress-screenshots-chrome
            path: "${{ github.workspace }}/cypress/reports/screenshots/"
        
        - name: Upload Mocha report to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-mocha-chrome
            path: "${{ github.workspace }}/cypress/reports/html/"
            
  Test-on-Firefox:
    runs-on: ubuntu-latest
    steps:
        - name: Checkout GitCode
          uses: actions/checkout@v3.3.0

        - name: Install dependencies
          uses: cypress-io/github-action@v5.0.8
          with:
            runTests: false

        - name: Run Cypress Tests
          uses: cypress-io/github-action@v5.0.8
          with:
            record: true
            parallel: true
            command: "npm run cy:stag:firefox"
          env:
            CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        
        # Known issue: doesn't record video for Firefox (https://github.com/cypress-io/cypress/issues/18415)    
        - name: Upload Videos to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-videos-firefox
            path: "${{ github.workspace }}/cypress/reports/videos/"

        - name: Upload Screenshots to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: failure()
          with:
            name: cypress-screenshots-firefox
            path: "${{ github.workspace }}/cypress/reports/screenshots/"
        
        - name: Upload Mocha report to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-mocha-firefox
            path: "${{ github.workspace }}/cypress/reports/html/"

```
## 13. Add `node_modules` to `.gitignore` 

## 14. Push everything to origin master

### Check GitHub actions and cypress dashboard

## 15. Create "dev" and "stag" branches (for our DEV and STAG environment)

### add the same yaml for STAG since it should be like PROD (master)

### add following yaml for DEV:

`.github/workflows/main.yml`
`
```yaml
name: Run tests against DEV environment
on:
  push:
    branches:
      - dev

jobs:
  Test-on-Chrome:
    runs-on: ubuntu-latest
    steps:
        - name: Checkout GitCode
          uses: actions/checkout@v3.3.0

        - name: Install dependencies
          uses: cypress-io/github-action@v5.0.8
          with:
            runTests: false

        - name: Run Cypress Tests
          uses: cypress-io/github-action@v5.0.8
          with:
            record: true
            parallel: true
            command: "npm run cy:dev:chrome"
          env:
            CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        
        - name: Upload Videos to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-videos-chrome
            path: "${{ github.workspace }}/cypress/reports/videos/"
          
        - name: Upload Screenshots to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: failure()
          with:
            name: cypress-screenshots-chrome
            path: "${{ github.workspace }}/cypress/reports/screenshots/"
        
        - name: Upload Mocha report to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-mocha-chrome
            path: "${{ github.workspace }}/cypress/reports/html/"
            
  Test-on-Firefox:
    runs-on: ubuntu-latest
    steps:
        - name: Checkout GitCode
          uses: actions/checkout@v3.3.0

        - name: Install dependencies
          uses: cypress-io/github-action@v5.0.8
          with:
            runTests: false

        - name: Run Cypress Tests
          uses: cypress-io/github-action@v5.0.8
          with:
            record: true
            parallel: true
            command: "npm run cy:dev:firefox"
          env:
            CYPRESS_RECORD_KEY: ${{ secrets.CYPRESS_RECORD_KEY }}
        
        # Known issue: doesn't record video for Firefox (https://github.com/cypress-io/cypress/issues/18415)    
        - name: Upload Videos to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-videos-firefox
            path: "${{ github.workspace }}/cypress/reports/videos/"

        - name: Upload Screenshots to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: failure()
          with:
            name: cypress-screenshots-firefox
            path: "${{ github.workspace }}/cypress/reports/screenshots/"
        
        - name: Upload Mocha report to Build Artifacts
          uses: actions/upload-artifact@v3.1.2
          if: always()
          with:
            name: cypress-mocha-firefox
            path: "${{ github.workspace }}/cypress/reports/html/"

```
### push "dev" and "stag" branchs and check

## 16. To run locally and record to dashboard

```
npx cypress run --record --key {PROJECT_ACCESS_KEY}
```

## THANK YOU 🙂
