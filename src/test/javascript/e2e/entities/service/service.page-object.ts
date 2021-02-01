import { element, by, ElementFinder } from 'protractor';

export class ServiceComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-service div table .btn-danger'));
  title = element.all(by.css('jhi-service div h2#page-heading span')).first();
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

export class ServiceUpdatePage {
  pageTitle = element(by.id('jhi-service-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  nomserviceInput = element(by.id('field_nomservice'));

  administrateurSelect = element(by.id('field_administrateur'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setNomserviceInput(nomservice: string): Promise<void> {
    await this.nomserviceInput.sendKeys(nomservice);
  }

  async getNomserviceInput(): Promise<string> {
    return await this.nomserviceInput.getAttribute('value');
  }

  async administrateurSelectLastOption(): Promise<void> {
    await this.administrateurSelect.all(by.tagName('option')).last().click();
  }

  async administrateurSelectOption(option: string): Promise<void> {
    await this.administrateurSelect.sendKeys(option);
  }

  getAdministrateurSelect(): ElementFinder {
    return this.administrateurSelect;
  }

  async getAdministrateurSelectedOption(): Promise<string> {
    return await this.administrateurSelect.element(by.css('option:checked')).getText();
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

export class ServiceDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-service-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-service'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
