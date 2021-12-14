import {Minterm, MintermTable} from "./models/minterm";
import {term} from "../models/term";


export function simplify(terms:Array<term>){

  // jede dieser anweisungen als einzelne Funktion:
  // terme zu Mintermen umwandeln
  // groupen der minterme
  // simplifizieren solange, bis keine mehr kombiniert werden können
  // nach essentiellen primimplikanten suchen
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
      .reduce((sum, currentCoefficient) => sum + currentCoefficient,0))
    .map((mintermSum, index) => [mintermSum, minterms[index]])
  let maxCoefficientSum = Math.max.apply(null, mintermsAndCoefficientSum.map(([sum,]) => sum))
  let possibleCoefficientSums = [...new Array(maxCoefficientSum+1).keys()]
  let mintermGroupings:Minterm[][] = possibleCoefficientSums
    .map(currentSum => mintermsAndCoefficientSum
      .filter(([coeffSum, minterm]) =>coeffSum == currentSum)
      .map(([num, minterm]) => minterm))
  return {mintermGrouping:mintermGroupings};
}
