import {Minterm, MintermTable} from "./models/minterm";
import {Term} from "../models/term";
import {group} from "@angular/animations";


export function simplify(terms:Array<Term>, allEvaluateTo: 0|1){
  terms = [...new Set(terms)] // make terms unique

  // convert terms to minterm
  let minterms:Array<Minterm> = terms.map(term => {
    return {varMultipliers: term.values, isUsed:false} as Minterm;
  })

  // jede dieser anweisungen als einzelne Funktion:
  // groupen der minterme
  let mintermTable = groupMinterms(minterms);
  // simplifizieren solange, bis keine mehr kombiniert werden können
  while(!canBeFurtherSimplified(mintermTable)){
    // simplify the MintermTable
    simplifyMintermTable(mintermTable);
    // remove duplicates
    mintermTable.mintermGrouping.map(grouping => [...new Set(grouping)])
  }
  // nach essentiellen primimplikanten suchen
  // findEssentialPrimimplicants(terms,mintermTable);
}

export function canBeFurtherSimplified(minterms:MintermTable):boolean{
  for(let index = 0; index< minterms.mintermGrouping.length; index++){
    if(minterms.mintermGrouping.length > index+1){
      let grouping = minterms.mintermGrouping[index];
      for (const element of grouping) {
        for(const elementFromNextGroup of minterms.mintermGrouping[index+1]){
          if(areCombineable(element,elementFromNextGroup)) return true;
        }
      }
    }
  }
  return false;
}
export function simplifyMintermTable(minterms: MintermTable):MintermTable{
  // TODO implement
  let newTable:MintermTable = {mintermGrouping:[]}
  // set the isUsed to false
  minterms.mintermGrouping.flat().forEach(element => element.isUsed = false);
  for(let index = 0; index< minterms.mintermGrouping.length; index++){
    if(minterms.mintermGrouping.length > index+1){
      const grouping = minterms.mintermGrouping[index];
      for (let j=0; j< grouping.length; j++) {
        const element = grouping[j];
        for(let nextGroupingIndex = 0; nextGroupingIndex<minterms.mintermGrouping[index+1].length; nextGroupingIndex++){
          const elementFromNextGroup = minterms.mintermGrouping[index+1][nextGroupingIndex]
          if(areCombineable(element,elementFromNextGroup)){
            insertIntoMintermTable(newTable, combineMinterms(element,elementFromNextGroup));
            minterms.mintermGrouping[index][j].isUsed = true;
            minterms.mintermGrouping[index+1][nextGroupingIndex].isUsed = true;
            console.log(element.isUsed, elementFromNextGroup.isUsed)
          }
        }
      }
      // move !isUsed prime implicants from current grouping to newTable
      for(const unusedMinterm of grouping.filter(element => element.isUsed == false)){
        insertIntoMintermTable(newTable, unusedMinterm);
      }
    }
  }
  return newTable;
}

export function insertIntoMintermTable(mintermTable:MintermTable, minterm:Minterm){
  let coefficientSum:number = minterm.varMultipliers
    .map(el => el as number)
    .reduce((sum,currentValue) => sum+(currentValue==1?1:0 ),0)
  if(mintermTable.mintermGrouping === undefined || mintermTable.mintermGrouping === null){
    mintermTable.mintermGrouping = []
  }
  while(mintermTable.mintermGrouping.length <= coefficientSum){
    mintermTable.mintermGrouping.push([])
  }
  mintermTable.mintermGrouping[coefficientSum].push(minterm);
}

export function combineMinterms(termA:Minterm, termB:Minterm):Minterm{
  let newMinterm:Minterm = {varMultipliers: [], isUsed:false}
  for(let i = 0; i<termA.varMultipliers.length; i++){
    newMinterm.varMultipliers.push(termA.varMultipliers[i] == termB.varMultipliers[i] ? termA.varMultipliers[i]:2 )
  }
  termA.isUsed = true;
  termB.isUsed = true;
  return newMinterm;
}


export function isTermCoveredByPrimimplicant(term: Term, primimplicant: Minterm): boolean {
  return primimplicant.varMultipliers.every((v,i) => 2 === v || term.values[i] === v);
}



export function findEssentialPrimimplicants(terms: Array<Term>, mintermTable:MintermTable):Array<Minterm>{
  const print = (t: boolean[][], aa: number) => {
    let x = "\n";
    for (const a of t) {
      for (const b of a) {
        x += b ? "#" : ".";
      }
      x +=  "\n";
    }
    console.log(x, aa);
  }

  const primimplicants = mintermTable.mintermGrouping.reduce((all, group) => [...all, ...group], []);

  let primimplicantTable: boolean[][] = [];
  for (const primimplicant of primimplicants) {
    const column = [];
    for (const term of terms) {
      column.push(isTermCoveredByPrimimplicant(term, primimplicant));
    }
    primimplicantTable.push(column);
  }
  print(primimplicantTable, -1);
  console.log(primimplicantTable);

  let updated: boolean;
  let kill = 0;
  let xLength = terms.length;
  let yLength = primimplicants.length;
  do {
    updated = false;
    for (let x = 0; x < xLength; x++) {
      let count = 0;
      let row = -1;
      for (let y = 0; y < yLength; y++) {
        if(primimplicantTable[y][x]) {
          row = y;
          count++;
          if(count >= 2){
            break;
          }
        }
      }
      if (count === 1) {
        updated = true;
        for (let x = 0; x < primimplicantTable.length; x++) {
          console.log(x, row);
          primimplicantTable[x].splice(row, 1);
        }
        primimplicantTable.splice(row, 1);
        xLength--;
        yLength--;
        print(primimplicantTable,kill);
      }
    }
    if(++kill > 10)
      break;
  } while (updated && xLength && yLength);
  throw new Error("Not Implemented");
}

export function areCombineable(termA:Minterm, termB:Minterm){
  let diffrentCoefficientCount = termA.varMultipliers
    .map(el => el as number)
    .reduce((sum, currentValue, index) => currentValue == (termB.varMultipliers[index] as number) ? sum : sum + 1, 0)
  return diffrentCoefficientCount <= 1;
}
export function groupMinterms(minterms:Array<Minterm>):MintermTable{
  let mintermsAndCoefficientSum:[number,Minterm][] = minterms
    .map(term => term.varMultipliers
      .map(el => el as number)
      .reduce((sum, currentCoefficient) => sum + (currentCoefficient==1?1:0),0))
    .map((mintermSum, index) => [mintermSum, minterms[index]])
  let maxCoefficientSum = Math.max.apply(null, mintermsAndCoefficientSum.map(([sum,]) => sum))
  let possibleCoefficientSums = [...new Array(maxCoefficientSum+1).keys()]
  let mintermGroupings:Minterm[][] = possibleCoefficientSums
    .map(currentSum => mintermsAndCoefficientSum
      .filter(([coeffSum, minterm]) =>coeffSum == currentSum)
      .map(([num, minterm]) => minterm))
  return {mintermGrouping:mintermGroupings};
}
