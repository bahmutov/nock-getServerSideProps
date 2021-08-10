/// <reference types="cypress" />

it('starts Next.js server', () => {
  cy.task('startNextApp')
  cy.visit('/')
})
