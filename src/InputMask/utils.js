export const mergeMask = (value, mask, placeholder = '_') => {
  const result = [];
  // Would creation of regexp on each call impact performance?
  const regex = new RegExp(placeholder, 'g');
  const maskCharacters = mask.replace(regex, '').split('');
  for (let i = 0; i < mask.length; i++) {
    const curMaskCharacter = mask.substring(i, i + 1);
    const curValueCharacter = value.substring(i, i + 1);

    let resultCharacter;
    if (curMaskCharacter === placeholder && maskCharacters.indexOf(curValueCharacter) === -1) {
      resultCharacter = curValueCharacter;
    } else if (maskCharacters.indexOf(curMaskCharacter) !== -1) {

      // There could be multiple characters in row, so running nested loop
      for (let j = i; j < mask.length; j++) {
        const curMaskCharacter = mask.substring(j, j + 1);
        if (maskCharacters.indexOf(curMaskCharacter) !== -1) {
          result.push(curMaskCharacter);
          result.push(curValueCharacter);
        } else {
          break;
        }
      }

    } else {
      resultCharacter = curMaskCharacter;
    }
    result.push(resultCharacter);
  }
  return result.slice(0, mask.length + 1).join('');
};