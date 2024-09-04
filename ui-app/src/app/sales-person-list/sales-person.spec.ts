import { SalesPerson } from './sales-person';

describe('SalesPerson', () => {
  it('should create an instance', () => {
    expect(new SalesPerson("test", "last", "email@email.com", 1)).toBeTruthy();
  });
});
