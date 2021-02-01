import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PatientComponentsPage, PatientDeleteDialog, PatientUpdatePage } from './patient.page-object';

const expect = chai.expect;

describe('Patient e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let patientComponentsPage: PatientComponentsPage;
  let patientUpdatePage: PatientUpdatePage;
  let patientDeleteDialog: PatientDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Patients', async () => {
    await navBarPage.goToEntity('patient');
    patientComponentsPage = new PatientComponentsPage();
    await browser.wait(ec.visibilityOf(patientComponentsPage.title), 5000);
    expect(await patientComponentsPage.getTitle()).to.eq('gestionPatientApp.patient.home.title');
    await browser.wait(ec.or(ec.visibilityOf(patientComponentsPage.entities), ec.visibilityOf(patientComponentsPage.noResult)), 1000);
  });

  it('should load create Patient page', async () => {
    await patientComponentsPage.clickOnCreateButton();
    patientUpdatePage = new PatientUpdatePage();
    expect(await patientUpdatePage.getPageTitle()).to.eq('gestionPatientApp.patient.home.createOrEditLabel');
    await patientUpdatePage.cancel();
  });

  it('should create and save Patients', async () => {
    const nbButtonsBeforeCreate = await patientComponentsPage.countDeleteButtons();

    await patientComponentsPage.clickOnCreateButton();

    await promise.all([
      patientUpdatePage.setNomeroInput('5'),
      patientUpdatePage.setNomInput('nom'),
      patientUpdatePage.setPrenomInput('prenom'),
      patientUpdatePage.setDatenaissanceInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      patientUpdatePage.setLieunaissanceInput('lieunaissance'),
      patientUpdatePage.setAdresseInput('adresse'),
      patientUpdatePage.genreSelectLastOption(),
      patientUpdatePage.setTelephoneInput('telephone'),
      patientUpdatePage.setCniInput('cni'),
      patientUpdatePage.setPasswordInput('password'),
    ]);

    expect(await patientUpdatePage.getNomeroInput()).to.eq('5', 'Expected nomero value to be equals to 5');
    expect(await patientUpdatePage.getNomInput()).to.eq('nom', 'Expected Nom value to be equals to nom');
    expect(await patientUpdatePage.getPrenomInput()).to.eq('prenom', 'Expected Prenom value to be equals to prenom');
    expect(await patientUpdatePage.getDatenaissanceInput()).to.contain(
      '2001-01-01T02:30',
      'Expected datenaissance value to be equals to 2000-12-31'
    );
    expect(await patientUpdatePage.getLieunaissanceInput()).to.eq(
      'lieunaissance',
      'Expected Lieunaissance value to be equals to lieunaissance'
    );
    expect(await patientUpdatePage.getAdresseInput()).to.eq('adresse', 'Expected Adresse value to be equals to adresse');
    expect(await patientUpdatePage.getTelephoneInput()).to.eq('telephone', 'Expected Telephone value to be equals to telephone');
    expect(await patientUpdatePage.getCniInput()).to.eq('cni', 'Expected Cni value to be equals to cni');
    expect(await patientUpdatePage.getPasswordInput()).to.eq('password', 'Expected Password value to be equals to password');

    await patientUpdatePage.save();
    expect(await patientUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await patientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Patient', async () => {
    const nbButtonsBeforeDelete = await patientComponentsPage.countDeleteButtons();
    await patientComponentsPage.clickOnLastDeleteButton();

    patientDeleteDialog = new PatientDeleteDialog();
    expect(await patientDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.patient.delete.question');
    await patientDeleteDialog.clickOnConfirmButton();

    expect(await patientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
