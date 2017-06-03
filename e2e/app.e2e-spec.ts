import { PlaniSoftV2Page } from './app.po';

describe('plani-soft-v2 App', () => {
  let page: PlaniSoftV2Page;

  beforeEach(() => {
    page = new PlaniSoftV2Page();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
