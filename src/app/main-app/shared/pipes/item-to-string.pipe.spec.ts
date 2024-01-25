import { ItemToStringPipe } from './item-to-string.pipe';

describe('ItemToStringPipe', () => {
  it('create an instance', () => {
    const pipe = new ItemToStringPipe();
    expect(pipe).toBeTruthy();
  });
});
