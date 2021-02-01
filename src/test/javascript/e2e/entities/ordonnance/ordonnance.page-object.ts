import { element, by, ElementFinder } from 'protractor';

export class OrdonnanceComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-ordonnance div table .btn-danger'));
  title = element.all(by.css('jhi-ordonnance div h2#page-heading span')).first();
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

export class OrdonnanceUpdatePage {
  pageTitle = element(by.id('jhi-ordonnance-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  dateInput = element(by.id('field_date'));

  medecinSelect = element(by.id('field_medecin'));
  patientSelect = element(by.id('field_patient'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setDateInput(date: string): Promise<void> {
    await this.dateInput.sendKeys(date);
  }

  async getDateInput(): Promise<string> {
    return await this.dateInput.getAttribute('value');
  }

  async medecinSelectLastOption(): Promise<void> {
    await this.medecinSelect.all(by.tagName('option')).last().click();
  }

  async medecinSelectOption(option: string): Promise<void> {
    await this.medecinSelect.sendKeys(option);
  }

  getMedecinSelect(): ElementFinder {
    return this.medecinSelect;
  }

  async getMedecinSelectedOption(): Promise<string> {
    return await this.medecinSelect.element(by.css('option:checked')).getText();
  }

  async patientSelectLastOption(): Promise<void> {
    await this.patientSelect.all(by.tagName('option')).last().click();
  }

  async patientSelectOption(option: string): Promise<void> {
    await this.patientSelect.sendKeys(option);
  }

  getPatientSelect(): ElementFinder {
    return this.patientSelect;
  }

  async getPatientSelectedOption(): Promise<string> {
    return await this.patientSelect.element(by.css('option:checked')).getText();
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

export class OrdonnanceDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-ordonnance-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-ordonnance'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}
