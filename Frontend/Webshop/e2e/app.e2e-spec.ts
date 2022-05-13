import { WebshopPage } from './app.po';

describe('webshop App', () => {
  let page: WebshopPage;

  beforeEach(() => {
    page = new WebshopPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
