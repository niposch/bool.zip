import {Minterm, MintermTable} from "./models/minterm";
import {Term} from "../models/term";
import {group} from "@angular/animations";


export function simplify(terms:Array<Term>, allEvaluateTo: 0|1) {
  terms = [...new Set(terms)] // make terms unique

  // convert terms to minterm
  let minterms: Array<Minterm> = terms.map(term => {
    return {varMultipliers: term.values, isUsed: false} as Minterm;
  })
  // jede dieser anweisungen als einzelne Funktion:
  // groupen der minterme
  let mintermTable = groupMinterms(minterms);
  simplifyMintermsToPrimeImplicants(mintermTable, allEvaluateTo);
  // nach essentiellen primimplikanten suchen
  // findEssentialPrimimplicants(terms,mintermTable);
}
// returns prime implicants
export function simplifyMintermsToPrimeImplicants(mintermTable:MintermTable, allEvaluateTo:0|1):Array<Minterm>{

  // simplifizieren solange, bis keine mehr kombiniert werden können
  while(canBeFurtherSimplified(mintermTable)){
    // simplify the MintermTable
    mintermTable = simplifyMintermTable(mintermTable);
  }
  return [...mintermTable.essentialTerms, ...mintermTable.mintermGrouping.flat()];
}

export function canBeFurtherSimplified(minterms:MintermTable):boolean{
  for(let index = 0; index< minterms.mintermGrouping.length; index++){
    if(minterms.mintermGrouping.length > index+1){
      let grouping = minterms.mintermGrouping[index];
      for (const element of grouping) {
        for(const elementFromNextGroup of minterms.mintermGrouping[index+1]){
          if(areCombineable(element,elementFromNextGroup))
            return true;
        }
      }
    }
  }
  return false;
}
export function simplifyMintermTable(minterms: MintermTable):MintermTable{
  // TODO implement
  let newTable:MintermTable = {mintermGrouping:[], essentialTerms: []}
  for(let groupingIndex = 0; groupingIndex < minterms.mintermGrouping.length; groupingIndex++){
    for(let termIndex = 0; termIndex < minterms.mintermGrouping[groupingIndex].length; termIndex++){
      if(groupingIndex + 1 < minterms.mintermGrouping.length){
        combineWithCombineableInNextRow(minterms,groupingIndex,termIndex, newTable)
      }
    }
  }
  newTable.essentialTerms = minterms.essentialTerms;
  for(const term of minterms.mintermGrouping.flat().filter(t => t.isUsed == false)){
    newTable.essentialTerms.push(term);
  }
  return newTable;
}

export function combineWithCombineableInNextRow(mintermTable:MintermTable, groupingIndex:number, termIndex:number, outputTable:MintermTable){
  const term = mintermTable.mintermGrouping[groupingIndex][termIndex];
  for(let nextGroupingTermIndex = 0; nextGroupingTermIndex < mintermTable.mintermGrouping[groupingIndex+1].length; nextGroupingTermIndex++){
    const termFromNextGrouping =mintermTable.mintermGrouping[groupingIndex + 1][nextGroupingTermIndex];
    if(areCombineable(term, termFromNextGrouping)){
      console.log("combined ", groupingIndex, " ", termIndex, " with ", groupingIndex + 1, " ", nextGroupingTermIndex)
      let newTerm = combineMinterms(term, termFromNextGrouping);
      term.isUsed = true;
      termFromNextGrouping.isUsed = true;
      insertIntoMintermTable(outputTable, newTerm)
    }
  }
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
  if(mintermTable.mintermGrouping[coefficientSum].length == 0 || mintermTable.mintermGrouping[coefficientSum].filter(term => term.varMultipliers.toString() == minterm.varMultipliers.toString()).length == 0){
    mintermTable.mintermGrouping[coefficientSum].push(minterm);
  }
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
  const essential: Minterm[] = [];
  const print = (t: string[][], aa: number) => {
    let x = "\n";
    for (const a of t) {
      for (const b of a) {
        x += b[0] === '_' ? "." : "#";
      }
      x +=  "\n";
    }
    console.log(x, aa);
  }

  const primimplicants = mintermTable.mintermGrouping.reduce((all, group) => [...all, ...group], []);

  let primimplicantTable: string[][] = [];
  for (const primimplicant of primimplicants) {
    const column = [];
    for (const term of terms) {
      column.push(isTermCoveredByPrimimplicant(term, primimplicant) ? `${JSON.stringify(primimplicant.varMultipliers)} -> ${JSON.stringify(term.values)}` : '_________________');
    }
    primimplicantTable.push(column);
  }
  print(primimplicantTable, -1);

  let updated: boolean;
  let kill = 0;
  do {
    updated = false;
    for (let x = 0; x < terms.length; x++) {
      let count = 0;
      let row = -1;
      for (let y = 0; y < primimplicants.length; y++) {
        if (primimplicantTable[y][x] !== '_________________') {
          row = y;
          count++;
          if (count >= 2) {
            break;
          }
        }
      }
      if (count === 1) {
        updated = true;
        for (let x = terms.length - 1; x >= 0; x--) {
          if (primimplicantTable[row][x] !== '_________________') {
            for (let y = 0; y < primimplicants.length; y++) {
              primimplicantTable[y].splice(x, 1);
            }
            terms.splice(x, 1);
          }
        }
        primimplicantTable.splice(row, 1);
        essential.push(...primimplicants.splice(row, 1));
        print(primimplicantTable, kill);
        console.log(essential, primimplicants, terms, kill);
      }
    }
    if(++kill > 10)
      break;
  } while (updated && terms.length && primimplicants.length);
  throw new Error("Not Implemented");
}

export function areCombineable(termA:Minterm, termB:Minterm){
  let diffrentCoefficientCount = termA.varMultipliers
    .map(el => el as number)
    .reduce(
      (sum, currentValue, index) => currentValue == (termB.varMultipliers[index] as number) ? sum : sum + 1, 0)
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
  return {mintermGrouping:mintermGroupings, essentialTerms:[]};
}
