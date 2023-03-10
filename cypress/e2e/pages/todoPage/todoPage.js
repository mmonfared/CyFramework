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
