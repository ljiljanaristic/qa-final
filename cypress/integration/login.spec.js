const data = require('../fixtures/data.json')

describe('login spec', () => {
    it('visit page', () => {
        cy.visit('https://gradebook.vivifyideas.com')
    })
    it('login', () => {
      cy.get('#email').type(data.email)

      cy.get('#userPassword').type(`${data.password}{enter}`)

      cy.intercept("POST", "https://gradebook-api.vivifyideas.com/api/login", (req) => {}).as('login')
      
      cy.wait('@login').then((intercept) => {
          expect(intercept.response.statusCode).to.eql(200)
          cy.log(intercept)
          window.localStorage.setItem('token', intercept.response.body.token)
      })
      cy.url().should('include', '/gradebooks')

      cy.get('#email').should('not.exist')
    })

})