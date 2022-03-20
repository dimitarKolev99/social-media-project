describe('My First Test', () => {
    it('visits index page and log in with wrong credentials', () => {
        cy.visit('http://localhost:3000/');

        
        cy.get('#email')
            .type('fake@test.com')
            .should('have.value', 'fake@test.com'); 
            
            cy.get('#password')
            .type('1234')
            .should('have.value', '1234');

            cy.get('#login').click();
            cy.url().should('include', '/error');
    });

    it('should visit the signup page', () => {
        cy.visit('http://localhost:3000/');

        
        cy.get('#signup').click();
            
        cy.url().should('include', '/signup');
    });

    // it()
});

