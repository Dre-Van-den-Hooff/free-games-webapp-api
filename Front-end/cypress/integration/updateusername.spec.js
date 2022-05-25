describe("update username", () => {
  it("log in", () => {
    cy.login("vandenhooffdre@gmail.com", "12345678");
  });

  it("updates", () => {
    cy.get("[data-cy=to_account]").click();
    cy.get("[data-cy=change_button]").click();
    cy.get("[data-cy=username_input]").type("Changed");
    cy.get("[data-cy=confirm_button]").click();
  });

  it("check if updated", () => {
    cy.get("[data-cy=welcome_heading]").contains("Welcome Changed");
  });
});
