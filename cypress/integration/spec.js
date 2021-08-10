/// <reference types="cypress" />

beforeEach(() => {
  cy.task('clearNock')
})

it('fetches a random joke', () => {
  cy.visit('/')
  cy.get('[data-cy=joke]').should('not.be.empty')
})

it('getServerSideProps returns mock', () => {
  const joke = 'Our wedding was so beautiful, even the cake was in tiers.'
  cy.task('nock', {
    hostname: 'https://icanhazdadjoke.com',
    method: 'GET',
    path: '/',
    statusCode: 200,
    body: {
      id: 'NmbFtH69hFd',
      joke,
      status: 200
    }
  })
  cy.visit('/')
  // nock has worked!
  cy.contains('[data-cy=joke]', joke)
})
