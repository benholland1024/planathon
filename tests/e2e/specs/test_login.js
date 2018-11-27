export function login() {
    cy.visit('localhost:8080/login')

    cy.get('input[type=text]').type('cypress@test.com')
    cy.get('input[type=password').type('2Bf3Nk9MnRuvGjVp')

    cy.get('button').click()
}

describe("Tests login ability", () => {
    it("can login to app", () => {
        login()

        cy.wait(2000)

        cy.get('#newOrgBtn').should('contain', '+ New Organization')
    })
    it("can logout", () => {
        login()

        cy.wait(2000)
        cy.get('h2').contains('Log Out').click()
        cy.wait(2000)
        cy.get('button').contains('GET STARTED')
    })
})