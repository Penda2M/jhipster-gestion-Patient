import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { TraitementComponentsPage, TraitementDeleteDialog, TraitementUpdatePage } from './traitement.page-object';

const expect = chai.expect;

describe('Traitement e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let traitementComponentsPage: TraitementComponentsPage;
  let traitementUpdatePage: TraitementUpdatePage;
  let traitementDeleteDialog: TraitementDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing('admin', 'admin');
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Traitements', async () => {
    await navBarPage.goToEntity('traitement');
    traitementComponentsPage = new TraitementComponentsPage();
    await browser.wait(ec.visibilityOf(traitementComponentsPage.title), 5000);
    expect(await traitementComponentsPage.getTitle()).to.eq('gestionPatientApp.traitement.home.title');
    await browser.wait(ec.or(ec.visibilityOf(traitementComponentsPage.entities), ec.visibilityOf(traitementComponentsPage.noResult)), 1000);
  });

  it('should load create Traitement page', async () => {
    await traitementComponentsPage.clickOnCreateButton();
    traitementUpdatePage = new TraitementUpdatePage();
    expect(await traitementUpdatePage.getPageTitle()).to.eq('gestionPatientApp.traitement.home.createOrEditLabel');
    await traitementUpdatePage.cancel();
  });

  it('should create and save Traitements', async () => {
    const nbButtonsBeforeCreate = await traitementComponentsPage.countDeleteButtons();

    await traitementComponentsPage.clickOnCreateButton();

    await promise.all([
      traitementUpdatePage.setIdTraitementInput('5'),
      traitementUpdatePage.setFraisInput('5'),
      traitementUpdatePage.ordonanceSelectLastOption(),
      traitementUpdatePage.medicamentSelectLastOption(),
    ]);

    expect(await traitementUpdatePage.getIdTraitementInput()).to.eq('5', 'Expected idTraitement value to be equals to 5');
    expect(await traitementUpdatePage.getFraisInput()).to.eq('5', 'Expected frais value to be equals to 5');

    await traitementUpdatePage.save();
    expect(await traitementUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await traitementComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Traitement', async () => {
    const nbButtonsBeforeDelete = await traitementComponentsPage.countDeleteButtons();
    await traitementComponentsPage.clickOnLastDeleteButton();

    traitementDeleteDialog = new TraitementDeleteDialog();
    expect(await traitementDeleteDialog.getDialogTitle()).to.eq('gestionPatientApp.traitement.delete.question');
    await traitementDeleteDialog.clickOnConfirmButton();

    expect(await traitementComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
