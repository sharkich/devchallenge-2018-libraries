import { Devchallenge2018librariesPage } from './app.po';

describe('devchallenge2018libraries App', function() {
  let page: Devchallenge2018librariesPage;

  beforeEach(() => {
    page = new Devchallenge2018librariesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
