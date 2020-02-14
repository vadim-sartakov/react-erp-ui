import { mergeMask } from './utils';

describe('InputMask utils', () => {
  
  describe('mergeMask', () => {
  
    it('should add one character at start', () => {
      const result = mergeMask('1__.__', '__.__');
      expect(result).toEqual('1_.__');
    });

    it('should add multiple characters at start', () => {
      const result = mergeMask('12_.__', '__.__');
      expect(result).toEqual('12.__');
    });

    it('should jump over when added one symbol before mask character', () => {
      const result = mergeMask('123.__', '__.__');
      expect(result).toEqual('12.3_');
    });

    it('should jump over when added multiple symbols overlapping with mask character', () => {
      const result = mergeMask('123__.__', '__.__');
      expect(result).toEqual('12.3_');
    });

    it('should jump over when added one symbol before multiple mask characters', () => {
      const result = mergeMask('1234.__', '__.__');
      expect(result).toEqual('12.34');
    });
    
  });

});