import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MedicamentComponentsPage, MedicamentDeleteDialog, MedicamentUpdatePage } from './medicament.page-object';

const expect = chai.expect;

describe('Medicament e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let medicamentComponentsPage: MedicamentComponentsPage;
  let medicamentUpdatePage: MedicamentUpdatePage;
  let medicamentDeleteDialog: MedicamentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Medicaments', async () => {
    await navBarPage.goToEntity('medicament');
    medicamentComponentsPage = new MedicamentComponentsPage();
    await browser.wait(ec.visibilityOf(medicamentComponentsPage.title), 5000);
    expect(await medicamentComponentsPage.getTitle()).to.eq('gestionPatientApp.medicament.home.title');
    await browser.wait(ec.or(ec.visibilityOf(medicamentComponentsPage.entities), ec.visibilityOf(medicamentComponentsPage.noResult)), 1000);
  });

  it('should load create Medicament page', async () => {
    await medicamentComponentsPage.clickOnCreateButton();
    medicamentUpdatePage = new MedicamentUpdatePage();
    expect(await medicamentUpdatePage.getPageTitle()).to.eq('gestionPatientApp.medicament.home.createOrEditLabel');
    await medicamentUpdatePage.cancel();
  });

  it('should create and save Medicaments', async () => {
    const nbButtonsBeforeCreate = await medicamentComponentsPage.countDeleteButtons();

    await medicamentComponentsPage.clickOnCreateButton();

    await promise.all([medicamentUpdatePage.setNomInput('nom'), medicamentUpdatePage.setDescriptionInput('description')]);

    expect(await medicamentUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await medicamentUpdatePage.getDescriptionInput()).to.eq('description', 'Expected Description value to be equals to description');

    await medicamentUpdatePage.save();
    expect(await medicamentUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await medicamentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Medicament', async () => {
    const nbButtonsBeforeDelete = await medicamentComponentsPage.countDeleteButtons();
    await medicamentComponentsPage.clickOnLastDeleteButton();

    medicamentDeleteDialog = new MedicamentDeleteDialog();
    expect(await medicamentDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.medicament.delete.question');
    await medicamentDeleteDialog.clickOnConfirmButton();

    expect(await medicamentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
