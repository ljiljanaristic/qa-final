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



describe('creeate gradebook spec', () => {
  beforeEach(() => {
    cy.loginTroughBackend()
  })
  it('visit create gradebook page', () => {
      cy.visit('https://gradebook.vivifyideas.com/gradebook/create')
  })
  it('create gradebook', () => {
    cy.get('#name').type(faker.name.firstName())

    // cy.get('select').select(data.name + ' ' + data.lastname) 
    cy.get('select > option')
    .eq(1)
    .then(element => cy.get('select').select(element.val()))
    cy.get('button[class="btn btn-submit btn-primary"]').click()
    cy.intercept("POST", "https://gradebook-api.vivifyideas.com/api/gradebooks/store", (req) => {}).as('create')
    
    cy.wait('@create').then((intercept) => {
        expect(intercept.response.statusCode).to.eql(201)
    })
    cy.url().should('include', '/gradebook')

    cy.get('#input-default1').should('not.exist')
    
  })
})