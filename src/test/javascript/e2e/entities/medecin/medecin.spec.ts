import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { MedecinComponentsPage, MedecinDeleteDialog, MedecinUpdatePage } from './medecin.page-object';

const expect = chai.expect;

describe('Medecin e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let medecinComponentsPage: MedecinComponentsPage;
  let medecinUpdatePage: MedecinUpdatePage;
  let medecinDeleteDialog: MedecinDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Medecins', async () => {
    await navBarPage.goToEntity('medecin');
    medecinComponentsPage = new MedecinComponentsPage();
    await browser.wait(ec.visibilityOf(medecinComponentsPage.title), 5000);
    expect(await medecinComponentsPage.getTitle()).to.eq('gestionPatientApp.medecin.home.title');
    await browser.wait(ec.or(ec.visibilityOf(medecinComponentsPage.entities), ec.visibilityOf(medecinComponentsPage.noResult)), 1000);
  });

  it('should load create Medecin page', async () => {
    await medecinComponentsPage.clickOnCreateButton();
    medecinUpdatePage = new MedecinUpdatePage();
    expect(await medecinUpdatePage.getPageTitle()).to.eq('gestionPatientApp.medecin.home.createOrEditLabel');
    await medecinUpdatePage.cancel();
  });

  it('should create and save Medecins', async () => {
    const nbButtonsBeforeCreate = await medecinComponentsPage.countDeleteButtons();

    await medecinComponentsPage.clickOnCreateButton();

    await promise.all([
      medecinUpdatePage.setMatriculeInput('matricule'),
      medecinUpdatePage.setNomInput('nom'),
      medecinUpdatePage.setPrenomInput('prenom'),
      medecinUpdatePage.setGrademedicalInput('grademedical'),
      medecinUpdatePage.setTelephoneInput('telephone'),
      medecinUpdatePage.setPasswordInput('password'),
      medecinUpdatePage.serviceSelectLastOption(),
    ]);

    expect(await medecinUpdatePage.getMatriculeInput()).to.eq('matricule', 'Expected Matricule value to be equals to matricule');
    expect(await medecinUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await medecinUpdatePage.getPrenomInput()).to.eq('prenom', 'Expected Prenom value to be equals to prenom');
    expect(await medecinUpdatePage.getGrademedicalInput()).to.eq(
      'grademedical',
      'Expected Grademedical value to be equals to grademedical'
    );
    expect(await medecinUpdatePage.getTelephoneInput()).to.eq('telephone', 'Expected Telephone value to be equals to telephone');
    expect(await medecinUpdatePage.getPasswordInput()).to.eq('password', 'Expected Password value to be equals to password');

    await medecinUpdatePage.save();
    expect(await medecinUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await medecinComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Medecin', async () => {
    const nbButtonsBeforeDelete = await medecinComponentsPage.countDeleteButtons();
    await medecinComponentsPage.clickOnLastDeleteButton();

    medecinDeleteDialog = new MedecinDeleteDialog();
    expect(await medecinDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.medecin.delete.question');
    await medecinDeleteDialog.clickOnConfirmButton();

    expect(await medecinComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
