/// <reference types="cypress"/>

describe('Signup test cases', ()=>{

    describe('Signup valid test cases',()=>{
        
        it('Normal scenario sign up using email',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("testuser005@gmail.com");
            cy.get('#password').should('be.visible').type("Tester@123$");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.url({timeout: 10000}).should('eq','https://www.codecademy.com/welcome/find-a-course');
            cy.get('main h2',{timeout: 10000}).should('be.visible').contains('Welcome to Codecademy!');
        });

        it('Sign up using Linkedin',()=>{
            // Remove access from linkedin for acessing data and clear browser data every time
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('button[aria-label="Sign up  with LinkedIn"][type=submit]',{timeout: 10000}).should('be.visible').click();
            cy.url().then((url) => {
                if (url.includes('linkedin')) {
                    cy.url({timeout: 15000}).then($url=>{
                        let url=$url.toString();
                        url.includes("https://www.linkedin.com/uas/login");
                        });
                    // has issues with the user generating CSRF token issue and sometimes redirecting to the login page because of failure in validation showing duplicate id and failing to load
                    cy.get('#username',{timeout: 10000}).clear().type('testblazefire@gmail.com');
                    cy.get('#password',{timeout:10000}).clear().type('TestUser@123$');
                    cy.get('button[aria-label="Sign in"]').click();
                    cy.url({timeout: 10000});
    
                    cy.url().then((url) => {
                        if (url.includes('linkedin')) {
                    // Check URL redirection or not
                            cy.get('button[value=authorize]').then($button => {
                                if ($button.is(':visible')){
                                    cy.get('button[value=authorize]').click();
                                }
                            });
                            cy.url({timeout: 10000}).should('include','learn');
                            cy.url({timeout: 10000}).should('include','welcome/find-a-course');
                            cy.title().should('eq','learn');
                            cy.title().should('eq','Welcome | Codecademy');
                        } 
                    });
                }
            }); 
        });
    });

    describe('Signup invalid test cases',()=>{
        
        it('Sign up with the same user email',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("testuser03@gmail.com");
            cy.get('#password').should('be.visible').type("Tester@123$");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').should('exist');
            cy.get('span[role=alert][aria-live=assertive]',{timeout: 15000}).should('be.visible').should('not.be.empty').contains('An account with this email already exists.');
        });

        it('Sign up with the invalid length password',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("testuser000009@gmail.com");
            cy.get('#password').should('be.visible').type("Tester");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').should('exist');
            cy.get('span[role=alert][aria-live=assertive]',{timeout: 15000}).should('be.visible').should('not.be.empty').contains('Password must include at least 8 characters.');
        });

        it('Sign up with the weak password',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("testuser000009@gmail.com");
            cy.get('#password').should('be.visible').type("Tester@12");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').should('exist');
            cy.get('span[role=alert][aria-live=assertive]',{timeout: 15000}).should('be.visible').should('not.be.empty').contains('This password is too weak.');
        });

        it('Sign up with the invalid email pattern',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("Testcheckercom");
            cy.get('#password').should('be.visible').type("Tester@1234$");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').should('exist');
            cy.get('span[role=alert][aria-live=assertive]',{timeout: 15000}).should('be.visible').should('not.be.empty').contains('Please enter a valid email address.');
        });

        it('Sign up with the insecure password',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("Testchecker0001@mail.com");
            cy.get('#password').should('be.visible').type("Tester@1234");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').should('exist');
            cy.get('span[role=alert][aria-live=assertive]',{timeout: 15000}).should('be.visible').should('not.be.empty').contains('This password may not be secure. Learn more.');
        });
    });
});