/// <reference types="cypress" />
// enable intellisense in VSCode

// both defines a test suite. describe() is common sense
// context()
describe('First test suite', () => {
	// body of the test itself

	// beforeEach(() => {
	// 	cy.contains('nb-card', 'Using the Grid').as('usingTheGridForm');
	// });

	it('locators', () => {
		cy.visit('/');
		cy.contains('Forms').click();
		cy.contains('Form Layouts').click();

		// by tag name
		cy.get('input');

		// by ID
		cy.get('#inputEmail1');

		// by single class value
		cy.get('.input-full-width');

		// by attribute name
		cy.get('[fullwidth]');

		// by attribute and it's value
		cy.get('[placeholder="Email"]');

		// by entire class (which is a value) value
		cy.get('[class="input-full-width size-medium shape-rectangle"]');

		// by two attributes
		cy.get('[placeholder="Email"][fullwidth]');

		// by tag attribute, id and class
		cy.get('input[placeholder="Email"]#inputEmail1.input-full-width');

		// by cypress test id - BEST PRACTICE
		cy.get('[data-cy="imputEmail1"]');
	});

	it('finding elements', () => {
		cy.visit('/');
		cy.contains('Forms').click();
		cy.contains('Form Layouts').click();

		// Theory
		// get() - find elements on the page by locator globally
		// find() - find child elements by locator
		// contains() - find HTML by text or text + locator

		// looks for the first match on the page
		cy.contains('[status="warning"]', 'Sign in');

		// finding component through parent
		cy.contains('nb-card', 'Horizontal form').find('button');
		cy.contains('nb-card', 'Horizontal form').contains('Sign in');

		// cypress chains and DOM
		// do not chain commands from an action like click and type. This can change the DOM structure and mess your test
		cy.get('#inputEmail3')
			.parents('form')
			.find('button')
			.should('contain', 'Sign in')
			.parents('form')
			.find('nb-checkbox')
			.click();
	});

	it('save subject of the command', () => {
		cy.visit('/');
		cy.contains('Forms').click();
		cy.contains('Form Layouts').click();

		// recycle subject to avoid code duplication
		cy.contains('nb-card', 'Using the Grid').find('[for="inputEmail1"]').should('contain', 'Email');
		cy.contains('nb-card', 'Using the Grid').find('[for="inputPassword2"]').should('contain', 'Password');

		// this doesn't work because cypress is async, you cannot do things like this, cypress has it's own way of saving the test subject
		// const usingTheGrid = cy.contains('nb-card', 'Using the Grid');
		// usingTheGrid.find('[for="inputEmail1"]').should('contain', 'Email');
		// usingTheGrid.find('[for="inputPassword2"]').should('contain', 'Password');

		// Approaches: #1 Cypress alias 
		// global scope, after defined can be used anywhere
		cy.contains('nb-card', 'Using the Grid').as('usingTheGrid');
		cy.get('@usingTheGrid').find('[for="inputEmail1"]').should('contain', 'Email');
		cy.get('@usingTheGrid').find('[for="inputPassword2"]').should('contain', 'Password');

		// #2 Cypress then() method
		// you can use the argument provided as an instance of the subject, but then it will be a JQuery element, not a Cypress chainable (can't use cypress commands) anymore
		// useful as a single instance/method/function - more use cases later in the course. Save values and process them with JS

		cy.contains('nb-card', 'Using the Grid').then(usingTheGridForm => {
			// THIS DOESN'T WORK - Returns is not a function. Hovering both find and should returns the element meaning that it isn't chainable
			// usingTheGridForm.find('[for="inputEmail1"]').should('contain', 'Email');
			
			// we can convert back the JQuery object into Cypress type of instance, we need to cy.wrap()
			cy.wrap(usingTheGridForm).find('[for="inputEmail1"]').should('contain', 'Email');
		});
	});

	it('extract text values from page', () => {
		cy.visit('/');
		cy.contains('Forms').click();
		cy.contains('Form Layouts').click();

		// 1 - normal assertion
		cy.get('[for="exampleInputEmail1"]').should('contain', 'Email address');

		// 2 - chai assertion (jQuery methods)
		cy.get('[for="exampleInputEmail1"]').then( label => {
			// label is now JQuery object
			const labelText = label.text();
			expect(labelText).to.equal('Email address');
			cy.wrap(labelText).should('contain', 'Email address');
		});

		// 3 - invoke HTML attribute of element. Shortcut for the above one
		cy.get('[for="exampleInputEmail1"]').invoke('text').then( text => {
			// "text" is the pure value, not an object
				expect(text).to.equal('Email address');
		});

		// "then" is not really needed for simple assertions
		cy.get('[for="exampleInputEmail1"]').invoke('text').should('equal', 'Email address');

		// saving as an alias
		cy.get('[for="exampleInputEmail1"]').invoke('text').as('labelText').should('equal', 'Email address');
		cy.get('@labelText').should('equal', 'Email address');

		// 4 - invoking value of a class. Useful when application state changes on performing actions
		cy.get('[for="exampleInputEmail1"]').invoke('attr', 'class').should('contain', 'label');

		// 5 - invoke properties. Useful when the component has HTML property as text, rather than just plain text content inside of it
		cy.get('#exampleInputEmail1').type('test@test.com');
		// this won't work
		// cy.get('#exampleInputEmail1').should('contain', 'test@test.com');
		
		// this is the correct way
		cy.get('#exampleInputEmail1').invoke('prop', 'value').should('contain', 'test@test.com').then( property => {
			expect(property).to.equal('test@test.com');
		});
	});

	it('radio buttons', () => {
		cy.visit('/');
		cy.contains('Forms').click();
		cy.contains('Form Layouts').click();
		
		// you can use method "check()" but it only works for input fields with type="radio" or type="checkbox"
		// input element is visually hidden, so we need to force it so cypress doesn't wait for it to be interactable
		// ONLY USE FORCE FOR THIS SCENARIO!
		cy.contains('nb-card', 'Using the Grid').find('[type="radio"]').then( radioButtons => {
			cy.wrap(radioButtons).eq(0).check({ force: true }).should('be.checked');
			cy.wrap(radioButtons).eq(1).check({ force: true }).should('be.checked');
			cy.wrap(radioButtons).eq(0).should('not.be.checked');
			cy.wrap(radioButtons).eq(2).should('be.disabled');
		});
	});

	it.only('checkboxes', () => {
		cy.visit('/');
		cy.contains('Modal & Overlays').click();
		cy.contains('Toastr').click();

		// you can use method "check()" but it only works for input fields with type="radio" or type="checkbox"
		// input element is visually hidden, so we need to force it so cypress doesn't wait for it to be interactable
		// ONLY USE FORCE FOR THIS SCENARIO!
		
		// check method validates the current status of the element
		// cy.get('[type="checkbox"]').uncheck( { force: true });
		
		cy.get('[type="checkbox"]').each(checkbox => {
			cy.wrap(checkbox).check({ force: true }).should('be.checked');
		});
		
		// click doesn't care and inverts it right away
		// cy.get('[type="checkbox"]').eq(0).click({ force: true });
	});
});