import BigNumber from 'bignumber.js';

export function fromTwosComplement(input: BigNumber | string, width: number) {
  let value: BigNumber;
  if (typeof input === 'string') {
    value = new BigNumber(input);
  } else {
    value = input;
  }
  let binary = input.toString(2);
  // pad width
  binary = binary.padStart(width, '0');
  if (binary.charAt(0) === '0') {
    // not a negative number, return as is
    return value;
  }
  const charArray = Array.from(binary);
  for (let i = 0; i < charArray.length; i += 1) {
    if (charArray[i] === '0') {
      charArray[i] = '1';
    } else {
      charArray[i] = '0';
    }
  }
  const final = new BigNumber(charArray.join(''), 2);

  return final.plus(1).multipliedBy(-1);
}
