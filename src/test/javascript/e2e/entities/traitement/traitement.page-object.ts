import { element, by, ElementFinder } from 'protractor';

export class TraitementComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-traitement div table .btn-danger'));
  title = element.all(by.css('jhi-traitement div h2#page-heading span')).first();
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

export class TraitementUpdatePage {
  pageTitle = element(by.id('jhi-traitement-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idTraitementInput = element(by.id('field_idTraitement'));
  fraisInput = element(by.id('field_frais'));

  ordonanceSelect = element(by.id('field_ordonance'));
  medicamentSelect = element(by.id('field_medicament'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdTraitementInput(idTraitement: string): Promise<void> {
    await this.idTraitementInput.sendKeys(idTraitement);
  }

  async getIdTraitementInput(): Promise<string> {
    return await this.idTraitementInput.getAttribute('value');
  }

  async setFraisInput(frais: string): Promise<void> {
    await this.fraisInput.sendKeys(frais);
  }

  async getFraisInput(): Promise<string> {
    return await this.fraisInput.getAttribute('value');
  }

  async ordonanceSelectLastOption(): Promise<void> {
    await this.ordonanceSelect.all(by.tagName('option')).last().click();
  }

  async ordonanceSelectOption(option: string): Promise<void> {
    await this.ordonanceSelect.sendKeys(option);
  }

  getOrdonanceSelect(): ElementFinder {
    return this.ordonanceSelect;
  }

  async getOrdonanceSelectedOption(): Promise<string> {
    return await this.ordonanceSelect.element(by.css('option:checked')).getText();
  }

  async medicamentSelectLastOption(): Promise<void> {
    await this.medicamentSelect.all(by.tagName('option')).last().click();
  }

  async medicamentSelectOption(option: string): Promise<void> {
    await this.medicamentSelect.sendKeys(option);
  }

  getMedicamentSelect(): ElementFinder {
    return this.medicamentSelect;
  }

  async getMedicamentSelectedOption(): Promise<string> {
    return await this.medicamentSelect.element(by.css('option:checked')).getText();
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

export class TraitementDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-traitement-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-traitement'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
