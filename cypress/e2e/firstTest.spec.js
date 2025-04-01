/// <reference types="cypress" />
// enable intellisense in VSCode

// both defines a test suite. describe() is common sense
// context()
describe('First test suite', () => {
	// body of the test itself
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
});