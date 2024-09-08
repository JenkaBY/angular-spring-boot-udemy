import {Product} from './product';

describe('Product', () => {
  it('should create an instance', () => {
    expect(new Product(1, '', '', '', 1, '', true, 1, new Date(), new Date())).toBeTruthy();
  });
});
