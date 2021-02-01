import { browser, ExpectedConditions as ec, protractor, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RendezVousComponentsPage, RendezVousDeleteDialog, RendezVousUpdatePage } from './rendez-vous.page-object';

const expect = chai.expect;

describe('RendezVous e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let rendezVousComponentsPage: RendezVousComponentsPage;
  let rendezVousUpdatePage: RendezVousUpdatePage;
  let rendezVousDeleteDialog: RendezVousDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load RendezVous', async () => {
    await navBarPage.goToEntity('rendez-vous');
    rendezVousComponentsPage = new RendezVousComponentsPage();
    await browser.wait(ec.visibilityOf(rendezVousComponentsPage.title), 5000);
    expect(await rendezVousComponentsPage.getTitle()).to.eq('gestionPatientApp.rendezVous.home.title');
    await browser.wait(ec.or(ec.visibilityOf(rendezVousComponentsPage.entities), ec.visibilityOf(rendezVousComponentsPage.noResult)), 1000);
  });

  it('should load create RendezVous page', async () => {
    await rendezVousComponentsPage.clickOnCreateButton();
    rendezVousUpdatePage = new RendezVousUpdatePage();
    expect(await rendezVousUpdatePage.getPageTitle()).to.eq('gestionPatientApp.rendezVous.home.createOrEditLabel');
    await rendezVousUpdatePage.cancel();
  });

  it('should create and save RendezVous', async () => {
    const nbButtonsBeforeCreate = await rendezVousComponentsPage.countDeleteButtons();

    await rendezVousComponentsPage.clickOnCreateButton();

    await promise.all([
      rendezVousUpdatePage.setIdRvInput('5'),
      rendezVousUpdatePage.setDateRvInput('01/01/2001' + protractor.Key.TAB + '02:30AM'),
      rendezVousUpdatePage.medecinSelectLastOption(),
      rendezVousUpdatePage.patientSelectLastOption(),
    ]);

    expect(await rendezVousUpdatePage.getIdRvInput()).to.eq('5', 'Expected idRv value to be equals to 5');
    expect(await rendezVousUpdatePage.getDateRvInput()).to.contain('2001-01-01T02:30', 'Expected dateRv value to be equals to 2000-12-31');

    await rendezVousUpdatePage.save();
    expect(await rendezVousUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await rendezVousComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last RendezVous', async () => {
    const nbButtonsBeforeDelete = await rendezVousComponentsPage.countDeleteButtons();
    await rendezVousComponentsPage.clickOnLastDeleteButton();

    rendezVousDeleteDialog = new RendezVousDeleteDialog();
    expect(await rendezVousDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.rendezVous.delete.question');
    await rendezVousDeleteDialog.clickOnConfirmButton();

    expect(await rendezVousComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
