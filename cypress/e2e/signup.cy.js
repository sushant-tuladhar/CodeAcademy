/// <reference types="cypress"/>

describe('Signup test cases', ()=>{

    describe('Signup valid test cases',()=>{
        
        xit('Normal scenario sign up using email',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('#email').should('be.visible').type("testuser03@gmail.com");
            cy.get('#password').should('be.visible').type("Tester@123$");
            cy.get('button[type=submit]',{timeout: 10000}).should('be.visible').contains('Sign up').click();
            cy.get('button[aria-label=Loading]',{timeout: 15000}).should('not.exist');
            cy.url({timeout: 10000}).should('eq','https://www.codecademy.com/welcome/find-a-course');
            cy.get('main h2',{timeout: 10000}).should('be.visible').contains('Welcome to Codecademy!');
        });

        it('Sign up using Linkedin',()=>{
            // Remove access from linkedin for acessing data and clear browser data every time

            cy.clearCookies();
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('button[aria-label="Sign up  with LinkedIn"][type=submit]',{timeout: 10000}).should('be.visible').click();
            cy.url({timeout:10000}).then($url=>{
                const url=$url.toString();
                expect(url).contains("https://www.linkedin.com/uas/login");
            });
            cy.get('#username', {timeout: 10000}).should('be.visible').clear().type('testblazefire@gmail.com');
            cy.get('#password', {timeout: 10000}).should('be.visible').type('TestUser@123$');
            cy.get('button[aria-label="Sign in"]',{timeout: 10000}).should('be.visible').click();
            cy.url({timeout:10000}).then($url=>{
                const url=$url.toString();
                expect(url).contains("https://www.linkedin.com/oauth/v2/login-success");
            });

            cy.get('#oauth__auth-form',{timeout: 15000}).should('be.visible').then(button=>{
                cy.get('#oauth__auth-form__submit-btn',{timeout: 15000}).should('be.enabled').click();
            });
            cy.pause();
        });

        xit('Sign up using Google',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");  
            cy.window().document().then(doc=>{
                doc.addEventListener('click', ()=>{
                    setTimeout(()=>{
                        Cypress.config('baseUrl',"https://accounts.google.com/o/oauth2/auth/identifier");
                        doc.location.reload();
                    },15000);                    
                });
                cy.get('button[aria-label="Sign up  with Google"][type=submit]',{timeout: 10000}).should('be.visible').click();
                cy.url({timeout:10000}).then($url=>{
                    const url=$url.toString();
                    expect(url).contains("https://accounts.google.com");
                });
                cy.get('#username', {timeout: 10000}).should('be.visible').type('Testuser@gmail.com');
                cy.get('#password', {timeout: 10000}).should('be.visible').type('Password');
            });
            

            // Login credentials required
        });

        // Sign up  with Facebook

        xit('Sign up using Facebook',()=>{
            cy.visit("/");
            cy.url().should('eq',Cypress.config("baseUrl")+"/");
            cy.get('button[aria-label="Sign up  with Facebook"][type=submit]',{timeout: 10000}).should('be.visible').click();
            cy.url({timeout:10000}).then($url=>{
                const url=$url.toString();
                expect(url).contains("https://www.facebook.com/v5.0/dialog/oauth");
            });
            cy.get('[data-testid="royal_email"]', {timeout: 10000}).should('be.visible').type('Testuser@gmail.com');
            cy.get('[data-testid="royal_pass"]', {timeout: 10000}).should('be.visible').type('Password');
            cy.get('[data-testid="royal_login_button"]',{timeout: 10000}).should('be.visible').click();
            // Login credentials required
        });
    });

    xdescribe('Signup invalid test cases',()=>{
        
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