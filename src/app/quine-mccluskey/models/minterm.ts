
export interface Minterm{
  varMultipliers:Array<number>;
  isUsed:boolean;
}

export interface MintermTable{
  // 1st array contains all minterms with 1 bit set to 1
  // 2st array contains all minterms with 2 bits set to 1
  mintermGrouping:Array<Array<Minterm>>;
}


