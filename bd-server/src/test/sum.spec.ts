import { sum } from './sum';

describe('default tests', () => {
  it('should test sum reducer', () => {
    const numbers = [1, 2, 3];
    expect(sum(...numbers)).toBe(1 + 2 + 3);
  });
});
