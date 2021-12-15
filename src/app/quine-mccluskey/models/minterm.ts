
export interface Minterm{
  varMultipliers:Array<0|1|2>;
  isUsed:boolean;
}

export interface MintermTable{
  // 1st array contains all minterms with 1 bit set to 1
  // 2st array contains all minterms with 2 bits set to 1
  mintermGrouping:Array<Array<Minterm>>;
  essentialTerms:Array<Minterm>;
}
