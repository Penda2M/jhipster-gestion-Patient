import { element, by, ElementFinder } from 'protractor';

export class MedecinComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-medecin div table .btn-danger'));
  title = element.all(by.css('jhi-medecin div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class MedecinUpdatePage {
  pageTitle = element(by.id('jhi-medecin-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  matriculeInput = element(by.id('field_matricule'));
  nomInput = element(by.id('field_nom'));
  prenomInput = element(by.id('field_prenom'));
  grademedicalInput = element(by.id('field_grademedical'));
  telephoneInput = element(by.id('field_telephone'));
  passwordInput = element(by.id('field_password'));

  serviceSelect = element(by.id('field_service'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setMatriculeInput(matricule: string): Promise<void> {
    await this.matriculeInput.sendKeys(matricule);
  }

  async getMatriculeInput(): Promise<string> {
    return await this.matriculeInput.getAttribute('value');
  }

  async setNomInput(nom: string): Promise<void> {
    await this.nomInput.sendKeys(nom);
  }

  async getNomInput(): Promise<string> {
    return await this.nomInput.getAttribute('value');
  }

  async setPrenomInput(prenom: string): Promise<void> {
    await this.prenomInput.sendKeys(prenom);
  }

  async getPrenomInput(): Promise<string> {
    return await this.prenomInput.getAttribute('value');
  }

  async setGrademedicalInput(grademedical: string): Promise<void> {
    await this.grademedicalInput.sendKeys(grademedical);
  }

  async getGrademedicalInput(): Promise<string> {
    return await this.grademedicalInput.getAttribute('value');
  }

  async setTelephoneInput(telephone: string): Promise<void> {
    await this.telephoneInput.sendKeys(telephone);
  }

  async getTelephoneInput(): Promise<string> {
    return await this.telephoneInput.getAttribute('value');
  }

  async setPasswordInput(password: string): Promise<void> {
    await this.passwordInput.sendKeys(password);
  }

  async getPasswordInput(): Promise<string> {
    return await this.passwordInput.getAttribute('value');
  }

  async serviceSelectLastOption(): Promise<void> {
    await this.serviceSelect.all(by.tagName('option')).last().click();
  }

  async serviceSelectOption(option: string): Promise<void> {
    await this.serviceSelect.sendKeys(option);
  }

  getServiceSelect(): ElementFinder {
    return this.serviceSelect;
  }

  async getServiceSelectedOption(): Promise<string> {
    return await this.serviceSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class MedecinDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-medecin-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-medecin'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
