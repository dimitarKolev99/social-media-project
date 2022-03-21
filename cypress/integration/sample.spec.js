describe('My First Test', () => {
    it('visits index page', () => {
        cy.visit('http://localhost:3000/');

        
        cy.get('#email')
            .type('fake@test.com')
            .should('have.value', 'fake@test.com'); 
            
            cy.get('#password')
            .type('1234')
            .should('have.value', '1234');

            // cy.get('#login').click();
            // cy.url().should('include', '/error');
    });

    it('should visit the signup page', () => {
        cy.visit('http://localhost:3000/');

        
        cy.get('#signup').click();
            
        cy.url().should('include', '/signup');
    });

    it('should visit the signup page and register a new user', () => {
        cy.visit('http://localhost:3000/');

        
        cy.get('#signup').click();
            
        cy.url().should('include', '/signup');

        cy.get('#username')
            .type('admin')
            .should('have.value', 'admin');

        cy.get('#email')
            .type('admin2@test.com')
            .should('have.value', 'admin2@test.com');

        cy.get('#password')
            .type('1234')
            .should('have.value', '1234');

        cy.get('#signup').click().then(() => {
            cy.wait(5000);
            cy.get('#email')
                    .type('admin2@test.com')
                    .should('have.value', 'admin2@test.com'); 
                    
                    cy.get('#password')
                    .type('1234')
                    .should('have.value', '1234');
            
                    cy.get('#login').click();
                    cy.url().should('include', '/feed');

        });


        
    });
    
    
});


    
