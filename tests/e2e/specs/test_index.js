// https://docs.cypress.io/api/introduction/api.html

describe('My First Test', () => {
  it('Visits the app root url', () => {
    cy.visit('localhost:8080/')
    cy.contains('span', 'Plan')
    cy.contains('span', 'a')
    cy.contains('span', 'thon')
  })
})
