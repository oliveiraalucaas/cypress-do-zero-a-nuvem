describe("Central de Atendimento ao Cliente TAT", () => {
  beforeEach(() => {
    cy.visit("./src/index.html");
  });
  it("verifica o título da aplicação", () => {
    const longText = Cypress._.repeat("abcdefghijklmnopqrstwxyz", 10);

    cy.title().should("be.equal", "Central de Atendimento ao Cliente TAT");
    cy.get("#firstName").type("Lucas");
    cy.get("#lastName").type("Oliveira");
    cy.get("#email").type("lucas@gmail.com");
    cy.get("#open-text-area").type(longText, { delay: 0 });
    cy.get('button[type="submit"]').click();
    cy.get(".success").should("be.visible");
  });
  it("Verifica se o e-mail tem o formato correto", () => {
    cy.get("#firstName").type("Lucas");
    cy.get("#lastName").type("Oliveira");
    cy.get("#email").type("lucas oliveira"); // inválido
    cy.get("#open-text-area").type("E-mail Invalido");
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });
  it("Testando bloqueio de letras em números", () => {
    cy.get("#firstName").type("Lucas");
    cy.get("#lastName").type("Oliveira");
    cy.get("#email").type("lucas@gmail.com");
    cy.get("#phone").type("abc");
    cy.get("#phone").should("have.value", "");
  });
  it("Exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Lucas");
    cy.get("#lastName").type("Oliveira");
    cy.get("#email").type("lucas@gmail.com");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();
    cy.get(".error").should("be.visible");
  });
  it("Preenche e limpa os campos nome, sobrenome, email e telefone", () => {
    cy.get("#firstName")
      .type("Lucas")
      .should("have.value", "Lucas")
      .clear()
      .should("have.value", "");
    cy.get("#lastName")
      .type("Oliveira")
      .should("have.value", "Oliveira")
      .clear()
      .should("have.value", "");
    cy.get("#email")
      .type("lucas@gmail.com")
      .should("have.value", "lucas@gmail.com")
      .clear()
      .should("have.value", "");
    cy.get("#phone")
      .type("48999999999")
      .should("have.value", "48999999999")
      .clear()
      .should("have.value", "");
  });
  it("Exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios", () => {
    cy.get('button[type="submit"]').click();
    cy.get(".error").should("be.visible", "Valide os campos obrigatórios!");
  });

  it("envia o formuário com sucesso usando um comando customizado", () => {
    const data = {
      firstName: "Lucas",
      lastName: "Oliveira",
      email: "lucas@gmail.com",
      text: "Teste.",
    };
    cy.fillMandatoryFieldsAndSubmit(data);

    cy.get('button[type="submit"]').click();
  });

  it("seleciona um produto (YouTube) por seu texto", () => {
    cy.get("#product").select("YouTube").should("have.value", "youtube");
  });
  it("seleciona um produto (Mentoria) por seu (value)", () => {
    cy.get("#product").select("mentoria").should("have.value", "mentoria");
  });
  it("seleciona um produto (Blog) por seu índice", () => {
    cy.get("#product").select(1).should("have.value", "blog");
  });

  it('marca o tipo de atendimento "Feedback"', () => {
    cy.get('input[type="radio"][value="feedback"]')
      .check()
      .should("be.checked");
  });

  it("marca cada de atendimento", () => {
    cy.get('input[type="radio"]').each((typeOfSevice) => {
      cy.wrap(typeOfSevice).check().should("be.checked");
    });
  });

  it("marca ambos checkboxes, depois desmarca o último", () => {
    cy.get('input[type="checkbox"]')
      .check()
      .should("be.checked")
      .last()
      .uncheck()
      .should("not.be.checked");
  });

  it("exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário", () => {
    cy.get("#firstName").type("Lucas");
    cy.get("#lastName").type("Oliveira");
    cy.get("#email").type("lucasoliveira@gmail.com");
    cy.get("#phone-checkbox").check();
    cy.contains("button", "Enviar").click();

    cy.get(".error").should("be.visible");
  });

  it("seleciona um arquivo da pasta fixtures", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json")
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo simulando um drag-and-drop", () => {
    cy.get("#file-upload")
      .selectFile("cypress/fixtures/example.json", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("seleciona um arquivo utilizando uma fixture para a qual foi dada um alias", () => {
    cy.fixture("example.json").as("exampleJason");
    cy.get("#file-upload")
      .selectFile("@exampleJason", { action: "drag-drop" })
      .should((input) => {
        expect(input[0].files[0].name).to.equal("example.json");
      });
  });

  it("verifica que a política de privacidade abre em outra aba sem a necessidade de um clique", () => {
    cy.contains("a", "Política de Privacidade")
      .should("have.attr", "href", "privacy.html")
      .and("have.attr", "target", "_blank");
  });

  it("acessa a página da política de privacidade removendo o target e então clicando no link", () => {
    cy.contains("a", "Política de Privacidade")
      .invoke("removeAttr", "target")
      .click();
    cy.contains("h1", "CAC TAT - Política de Privacidade").should("be.visible");
  });
});
