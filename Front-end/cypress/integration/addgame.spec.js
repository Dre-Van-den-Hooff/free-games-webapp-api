describe("add game to database", () => {
  it("log in", () => {
    cy.login("vandenhooffdre@gmail.com", "12345678");
  });

  it("add game", () => {
    cy.visit("http://localhost:3000/#/addgame");
    cy.get("[data-cy=title_input]").type("Test title");
    cy.get("[data-cy=genre_input]").select("Survival");
    cy.get("[data-cy=date_input]").type("2021-12-13");
    cy.get("[data-cy=developer_input]").type("Test developer");
    cy.get("[data-cy=submit_game]").click();
  });

  it("check if game is added", () => {
    cy.visit("http://localhost:3000/#/home");
    // id 27
    cy.get("[data-cy=game_title]").eq(26).contains("Test title");
  });

  it("remove again from database", () => {
    cy.request("DELETE", "http://localhost:9000/api/games/27");
  });
});
