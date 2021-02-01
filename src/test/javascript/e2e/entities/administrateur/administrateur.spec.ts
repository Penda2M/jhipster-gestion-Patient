import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { AdministrateurComponentsPage, AdministrateurDeleteDialog, AdministrateurUpdatePage } from './administrateur.page-object';

const expect = chai.expect;

describe('Administrateur e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let administrateurComponentsPage: AdministrateurComponentsPage;
  let administrateurUpdatePage: AdministrateurUpdatePage;
  let administrateurDeleteDialog: AdministrateurDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Administrateurs', async () => {
    await navBarPage.goToEntity('administrateur');
    administrateurComponentsPage = new AdministrateurComponentsPage();
    await browser.wait(ec.visibilityOf(administrateurComponentsPage.title), 5000);
    expect(await administrateurComponentsPage.getTitle()).to.eq('gestionPatientApp.administrateur.home.title');
    await browser.wait(
      ec.or(ec.visibilityOf(administrateurComponentsPage.entities), ec.visibilityOf(administrateurComponentsPage.noResult)),
      1000
    );
  });

  it('should load create Administrateur page', async () => {
    await administrateurComponentsPage.clickOnCreateButton();
    administrateurUpdatePage = new AdministrateurUpdatePage();
    expect(await administrateurUpdatePage.getPageTitle()).to.eq('gestionPatientApp.administrateur.home.createOrEditLabel');
    await administrateurUpdatePage.cancel();
  });

  it('should create and save Administrateurs', async () => {
    const nbButtonsBeforeCreate = await administrateurComponentsPage.countDeleteButtons();

    await administrateurComponentsPage.clickOnCreateButton();

    await promise.all([
      administrateurUpdatePage.setNomInput('nom'),
      administrateurUpdatePage.setPrenomInput('prenom'),
      administrateurUpdatePage.setEmailInput('email'),
      administrateurUpdatePage.setPasswordInput('password'),
    ]);

    expect(await administrateurUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await administrateurUpdatePage.getPrenomInput()).to.eq('prenom', 'Expected Prenom value to be equals to prenom');
    expect(await administrateurUpdatePage.getEmailInput()).to.eq('email', 'Expected Email value to be equals to email');
    expect(await administrateurUpdatePage.getPasswordInput()).to.eq('password', 'Expected Password value to be equals to password');

    await administrateurUpdatePage.save();
    expect(await administrateurUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await administrateurComponentsPage.countDeleteButtons()).to.eq(
      nbButtonsBeforeCreate + 1,
      'Expected one more entry in the table'
    );
  });

  it('should delete last Administrateur', async () => {
    const nbButtonsBeforeDelete = await administrateurComponentsPage.countDeleteButtons();
    await administrateurComponentsPage.clickOnLastDeleteButton();

    administrateurDeleteDialog = new AdministrateurDeleteDialog();
    expect(await administrateurDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.administrateur.delete.question');
    await administrateurDeleteDialog.clickOnConfirmButton();

    expect(await administrateurComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
