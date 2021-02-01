import { element, by, ElementFinder } from 'protractor';

export class PatientComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-patient div table .btn-danger'));
  title = element.all(by.css('jhi-patient div h2#page-heading span')).first();
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

export class PatientUpdatePage {
  pageTitle = element(by.id('jhi-patient-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nomeroInput = element(by.id('field_nomero'));
  nomInput = element(by.id('field_nom'));
  prenomInput = element(by.id('field_prenom'));
  datenaissanceInput = element(by.id('field_datenaissance'));
  lieunaissanceInput = element(by.id('field_lieunaissance'));
  adresseInput = element(by.id('field_adresse'));
  genreSelect = element(by.id('field_genre'));
  telephoneInput = element(by.id('field_telephone'));
  cniInput = element(by.id('field_cni'));
  passwordInput = element(by.id('field_password'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNomeroInput(nomero: string): Promise<void> {
    await this.nomeroInput.sendKeys(nomero);
  }

  async getNomeroInput(): Promise<string> {
    return await this.nomeroInput.getAttribute('value');
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

  async setDatenaissanceInput(datenaissance: string): Promise<void> {
    await this.datenaissanceInput.sendKeys(datenaissance);
  }

  async getDatenaissanceInput(): Promise<string> {
    return await this.datenaissanceInput.getAttribute('value');
  }

  async setLieunaissanceInput(lieunaissance: string): Promise<void> {
    await this.lieunaissanceInput.sendKeys(lieunaissance);
  }

  async getLieunaissanceInput(): Promise<string> {
    return await this.lieunaissanceInput.getAttribute('value');
  }

  async setAdresseInput(adresse: string): Promise<void> {
    await this.adresseInput.sendKeys(adresse);
  }

  async getAdresseInput(): Promise<string> {
    return await this.adresseInput.getAttribute('value');
  }

  async setGenreSelect(genre: string): Promise<void> {
    await this.genreSelect.sendKeys(genre);
  }

  async getGenreSelect(): Promise<string> {
    return await this.genreSelect.element(by.css('option:checked')).getText();
  }

  async genreSelectLastOption(): Promise<void> {
    await this.genreSelect.all(by.tagName('option')).last().click();
  }

  async setTelephoneInput(telephone: string): Promise<void> {
    await this.telephoneInput.sendKeys(telephone);
  }

  async getTelephoneInput(): Promise<string> {
    return await this.telephoneInput.getAttribute('value');
  }

  async setCniInput(cni: string): Promise<void> {
    await this.cniInput.sendKeys(cni);
  }

  async getCniInput(): Promise<string> {
    return await this.cniInput.getAttribute('value');
  }

  async setPasswordInput(password: string): Promise<void> {
    await this.passwordInput.sendKeys(password);
  }

  async getPasswordInput(): Promise<string> {
    return await this.passwordInput.getAttribute('value');
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

export class PatientDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-patient-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-patient'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
