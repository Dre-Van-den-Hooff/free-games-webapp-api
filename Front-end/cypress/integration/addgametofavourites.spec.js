describe("add game to favourites", () => {
  it("log in", () => {
    cy.login("vandenhooffdre@gmail.com", "12345678");
  });

  it("add game to favourites", () => {
    cy.get("[data-cy=add_to_favourites_button]").eq(0).click();
  });

  it("check if game is added", () => {
    cy.get("[data-cy=to_favourites]").click();
    cy.get("[data-cy=favourites_title]").eq(0).contains("Dauntless");
  });

  it("remove again from favourites", () => {
    cy.login("vandenhooffdre@gmail.com", "12345678");
    cy.get("[data-cy=to_favourites]").click();
    cy.get("[data-cy=favourites_remove_button]").eq(0).click();
  });
});
