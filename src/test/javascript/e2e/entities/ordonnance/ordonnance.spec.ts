import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { OrdonnanceComponentsPage, OrdonnanceDeleteDialog, OrdonnanceUpdatePage } from './ordonnance.page-object';

const expect = chai.expect;

describe('Ordonnance e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let ordonnanceComponentsPage: OrdonnanceComponentsPage;
  let ordonnanceUpdatePage: OrdonnanceUpdatePage;
  let ordonnanceDeleteDialog: OrdonnanceDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Ordonnances', async () => {
    await navBarPage.goToEntity('ordonnance');
    ordonnanceComponentsPage = new OrdonnanceComponentsPage();
    await browser.wait(ec.visibilityOf(ordonnanceComponentsPage.title), 5000);
    expect(await ordonnanceComponentsPage.getTitle()).to.eq('gestionPatientApp.ordonnance.home.title');
    await browser.wait(ec.or(ec.visibilityOf(ordonnanceComponentsPage.entities), ec.visibilityOf(ordonnanceComponentsPage.noResult)), 1000);
  });

  it('should load create Ordonnance page', async () => {
    await ordonnanceComponentsPage.clickOnCreateButton();
    ordonnanceUpdatePage = new OrdonnanceUpdatePage();
    expect(await ordonnanceUpdatePage.getPageTitle()).to.eq('gestionPatientApp.ordonnance.home.createOrEditLabel');
    await ordonnanceUpdatePage.cancel();
  });

  it('should create and save Ordonnances', async () => {
    const nbButtonsBeforeCreate = await ordonnanceComponentsPage.countDeleteButtons();

    await ordonnanceComponentsPage.clickOnCreateButton();

    await promise.all([
      ordonnanceUpdatePage.setDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      ordonnanceUpdatePage.medecinSelectLastOption(),
      ordonnanceUpdatePage.patientSelectLastOption(),
    ]);

    expect(await ordonnanceUpdatePage.getDateInput()).to.contain('2001-01-01T02:30', 'Expected date value to be equals to 2000-12-31');

    await ordonnanceUpdatePage.save();
    expect(await ordonnanceUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await ordonnanceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Ordonnance', async () => {
    const nbButtonsBeforeDelete = await ordonnanceComponentsPage.countDeleteButtons();
    await ordonnanceComponentsPage.clickOnLastDeleteButton();

    ordonnanceDeleteDialog = new OrdonnanceDeleteDialog();
    expect(await ordonnanceDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.ordonnance.delete.question');
    await ordonnanceDeleteDialog.clickOnConfirmButton();

    expect(await ordonnanceComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
