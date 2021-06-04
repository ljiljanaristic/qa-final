const data = require('../fixtures/data.json')
const faker = require('faker')

Cypress.Commands.add('loginTroughBackend', (userName, password) => {
  cy.request({
      method: "POST",
      url : "https://gradebook-api.vivifyideas.com/api/login",
      body : {
          email : data.email,
          password : data.password
      }
  }).its('body').then((response) => {
      cy.log(response)
      window.localStorage.setItem('loginToken', response.token)
  })
})



describe('creeate professor spec', () => {
  beforeEach(() => {
    cy.loginTroughBackend()
  })
  it('visit create professor page', () => {
      cy.visit('https://gradebook.vivifyideas.com/professors/create')
  })
  it('create professor', () => {
    cy.get('#input-default').type(data.name)

    cy.get('#input-default1').type(data.lastname)

    cy.get('button[class="btn btn-image btn-primary"]').click()
    cy.get('input[class="form-control"]').last().type(data.image)
    // cy.get('select').select(faker.name.firstName())
    cy.get('select > option')
    .eq(1)
    .then(element => cy.get('select').select(element.val()))
    cy.get('button[class="btn btn-secondary"]').click()
    cy.intercept("POST", "https://gradebook-api.vivifyideas.com/api/professors/create", (req) => {}).as('create')
    
    cy.wait('@create').then((intercept) => {
        expect(intercept.response.statusCode).to.eql(200)
    })
    cy.url().should('include', '/professors')

    cy.get('#input-default1').should('not.exist')
    
  })
})