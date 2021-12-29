import BigNumber from "bignumber.js";

export function fromTwosComplement(value: BigNumber | string, width: number) {
  let _value: BigNumber;
  if (typeof value === "string") {
    _value = new BigNumber(value);
  } else {
    _value = value;
  }
  let binary = value.toString(2);
  //pad width
  binary = binary.padStart(width, '0');
  if(binary.charAt(0) === '0'){
    return _value;
  }
  let flipped = '';
  for(var i = 0; i< binary.length; i++) {
    flipped = flipped.concat(binary[i] === '0' ? '1' : '0');
  }
  let final = new BigNumber(flipped,2);

  return final.plus(1).multipliedBy(-1);
}