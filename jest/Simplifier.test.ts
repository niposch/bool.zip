import {Minterm, MintermTable} from "../src/app/quine-mccluskey/models/minterm";
import {
  areCombineable,
  canBeFurtherSimplified, findEssentialPrimimplicants,
  groupMinterms, insertIntoMintermTable, simplifyMintermsToPrimeImplicants,
  simplifyMintermTable
} from "../src/app/quine-mccluskey/Simplifier";


describe("Simplifier Tests", () => {
  it("should simplify wikipedias minterm table by one", () => {

    const mintermTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping: [
        [{varMultipliers: [0, 0, 0, 0], isUsed: false}],
        [
          {varMultipliers: [0, 0, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 0, 0], isUsed: false},
          {varMultipliers: [1, 0, 0, 0], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 1, 0], isUsed: false},
          {varMultipliers: [1, 0, 0, 1], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 1, 1], isUsed: false},
          {varMultipliers: [1, 0, 1, 1], isUsed: false},
        ],
        [
          {varMultipliers: [1, 1, 1, 1], isUsed: false},
        ],
      ]
    }
    const expectedSimplifiedTable = {
      mintermGrouping: [
        [{varMultipliers: [0, 0, 0, 2], isUsed: false}],
        [
          {varMultipliers: [0, 0, 0, 2], isUsed: false},
          {varMultipliers: [0, 2, 0, 0], isUsed: false},
          {varMultipliers: [2, 0, 0, 0], isUsed: false},
        ],
        [
          {varMultipliers: [0, 2, 0, 1], isUsed: false},
          {varMultipliers: [2, 0, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 2, 0], isUsed: false},
          {varMultipliers: [0, 1, 2, 0], isUsed: false},
          {varMultipliers: [0, 1, 0, 2], isUsed: false},
          {varMultipliers: [1, 0, 0, 2], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 2, 1], isUsed: false},
          {varMultipliers: [0, 1, 1, 2], isUsed: false},
          {varMultipliers: [1, 0, 2, 1], isUsed: false},
        ],
        [
          {varMultipliers: [2, 1, 1, 1], isUsed: false},
          {varMultipliers: [1, 2, 1, 1], isUsed: false},
        ],
      ]
    }
    const simplifiedMintermTable = simplifyMintermTable(mintermTable);
    mintermTable.mintermGrouping.flat().forEach(el => expect(el.isUsed).toBe(true))
    simplifiedMintermTable.mintermGrouping.flat().forEach(el => expect(el.isUsed).toBe(false))
    simplifiedMintermTable.mintermGrouping.forEach((grouping, index) => {
      expect(expectedSimplifiedTable.mintermGrouping[index]
        .some(
          (minTerm, mintermIndex) => minTerm.varMultipliers.toString() === expectedSimplifiedTable.mintermGrouping[index][mintermIndex].varMultipliers.toString()
        )).toBe(true);
    })
  })
  it("should do the simplification of wikipedias 2nd minterm table by one", () => {

    let expectedIsUsedBools = {
      mintermGrouping:
        [
          [{varMultipliers: [0, 0, 0, 2], isUsed: true}],
          [
            {varMultipliers: [0, 0, 0, 2], isUsed: true},
            {varMultipliers: [0, 2, 0, 0], isUsed: true},
            {varMultipliers: [2, 0, 0, 0], isUsed: true},
          ],
          [
            {varMultipliers: [0, 2, 0, 1], isUsed: true},
            {varMultipliers: [2, 0, 0, 1], isUsed: true},
            {varMultipliers: [0, 1, 2, 0], isUsed: true},
            {varMultipliers: [0, 1, 2, 0], isUsed: true},
            {varMultipliers: [0, 1, 0, 2], isUsed: true},
            {varMultipliers: [1, 0, 0, 2], isUsed: true},
          ],
          [
            {varMultipliers: [0, 1, 2, 1], isUsed: true},
            {varMultipliers: [0, 1, 1, 2], isUsed: true},
            {varMultipliers: [1, 0, 2, 1], isUsed: false},
          ],
          [
            {varMultipliers: [2, 1, 1, 1], isUsed: false},
            {varMultipliers: [1, 2, 1, 1], isUsed: false},
          ],
        ]
    }
    const mintermTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping: [
        [
          {varMultipliers: [0, 0, 0, 2], isUsed: false},
          {varMultipliers: [0, 2, 0, 0], isUsed: false},
          {varMultipliers: [2, 0, 0, 0], isUsed: false},
        ],
        [
          {varMultipliers: [0, 2, 0, 1], isUsed: false},
          {varMultipliers: [2, 0, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 2, 0], isUsed: false},
          {varMultipliers: [0, 1, 2, 0], isUsed: false},
          {varMultipliers: [0, 1, 0, 2], isUsed: false},
          {varMultipliers: [1, 0, 0, 2], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 2, 1], isUsed: false},
          {varMultipliers: [0, 1, 1, 2], isUsed: false},
          {varMultipliers: [1, 0, 2, 1], isUsed: false},
        ],
        [
          {varMultipliers: [2, 1, 1, 1], isUsed: false},
          {varMultipliers: [1, 2, 1, 1], isUsed: false},
        ],
      ]
    }
    const expectedSimplifiedTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping:
        [
          [
            {varMultipliers: [0, 2, 0, 2], isUsed: false},
            {varMultipliers: [2, 0, 0, 2], isUsed: false},
          ],
          [
            {varMultipliers: [0, 1, 2, 2], isUsed: false},
          ],
          [
            {varMultipliers: [1, 0, 2, 1], isUsed: false},
          ],
          [
            {varMultipliers: [2, 1, 1, 1], isUsed: false},
            {varMultipliers: [1, 2, 1, 1], isUsed: false},
          ]
        ]
    }
    const simplifiedMintermTable = simplifyMintermTable(mintermTable);
    // TODO implement verification
  })
});
describe("minterm simplification of multiple steps", ()=>{
  it("it should calculate the minterms laid out in wikipedia", ()=>{

    const mintermTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping: [
        [{varMultipliers: [0, 0, 0, 0], isUsed: false}],
        [
          {varMultipliers: [0, 0, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 0, 0], isUsed: false},
          {varMultipliers: [1, 0, 0, 0], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 1, 0], isUsed: false},
          {varMultipliers: [1, 0, 0, 1], isUsed: false},
        ],
        [
          {varMultipliers: [0, 1, 1, 1], isUsed: false},
          {varMultipliers: [1, 0, 1, 1], isUsed: false},
        ],
        [
          {varMultipliers: [1, 1, 1, 1], isUsed: false},
        ],
      ]
    }
    let res = simplifyMintermsToPrimeImplicants(mintermTable, 0);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [1,0,2,1].toString())).toBe(true);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [2,1,1,1].toString())).toBe(true);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [1,2,1,1].toString())).toBe(true);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [0,2,0,2].toString())).toBe(true);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [2,0,0,2].toString())).toBe(true);
    expect(res.map(minterm => minterm.varMultipliers as number[]).some(element => element.toString() == [0,1,2,2].toString())).toBe(true);
    expect(res.length).toBe(6)
  })
})
describe("Simplifier Helper", () => {
  it("minterms should be grouped", () => {
    let minterms = new Array<Minterm>();
    minterms.push({varMultipliers: [1, 0, 1, 0], isUsed: false})
    minterms.push({varMultipliers: [0, 1, 1, 0], isUsed: false})
    minterms.push({varMultipliers: [1, 1, 0, 0], isUsed: false})
    let groupedMinterms = groupMinterms(minterms);
    expect(groupedMinterms.mintermGrouping.length).toBe(3)
    expect(groupedMinterms.mintermGrouping[2].length).toBe(3)
    expect(groupedMinterms.mintermGrouping[0].length).toBe(0)
    expect(groupedMinterms.mintermGrouping[1].length).toBe(0)

  })
  it("using diffrent minterms should work", () => {
    let minterms = new Array<Minterm>();
    minterms.push({varMultipliers: [1, 0, 1, 0], isUsed: false})
    minterms.push({varMultipliers: [0, 1, 1, 0], isUsed: false})
    minterms.push({varMultipliers: [1, 1, 0, 0], isUsed: false})
    minterms.push({varMultipliers: [1, 1, 1, 0], isUsed: false})
    minterms.push({varMultipliers: [0, 1, 1, 1], isUsed: false})
    let groupedMinterms = groupMinterms(minterms);
    expect(groupedMinterms.mintermGrouping.length).toBe(4)
    expect(groupedMinterms.mintermGrouping[2].length).toBe(3)
    expect(groupedMinterms.mintermGrouping[3].length).toBe(2)
    expect(groupedMinterms.mintermGrouping[0].length).toBe(0)
    expect(groupedMinterms.mintermGrouping[1].length).toBe(0)

  })
  it("grouping minterms should work", () => {
    let termA: Minterm = {varMultipliers: [1, 1, 1, 0], isUsed: false}
    let termB: Minterm = {varMultipliers: [1, 1, 1, 0], isUsed: false}
    expect(areCombineable(termA, termB)).toBe(true);
  })
  it("grouping minterms with 1 var diffrent should work", () => {
    let termA: Minterm = {varMultipliers: [1, 1, 0, 0], isUsed: false}
    let termB: Minterm = {varMultipliers: [1, 1, 1, 0], isUsed: false}
    expect(areCombineable(termA, termB)).toBe(true);
  })
  it("grouping minterms should not work", () => {
    let termA: Minterm = {varMultipliers: [1, 0, 1, 0], isUsed: false}
    let termB: Minterm = {varMultipliers: [1, 1, 0, 1], isUsed: false}
    expect(areCombineable(termA, termB)).toBe(false);
  })
  it("grouping these minterms should not work", () => {
    let termA: Minterm = {varMultipliers: [2, 0, 1, 1], isUsed: false}
    let termB: Minterm = {varMultipliers: [1, 2, 1, 1], isUsed: false}
    expect(areCombineable(termA, termB)).toBe(false);
  })
  it("grouping these minterms should work", () => {
    let termA: Minterm = {varMultipliers: [2, 2, 1, 1], isUsed: false}
    let termB: Minterm = {varMultipliers: [1, 2, 1, 1], isUsed: false}
    expect(areCombineable(termA, termB)).toBe(true);
  })


  it("can further be simplified", () => {
    let termTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping: [
        [],
        [],
        [],
        [{varMultipliers: [1, 1, 1, 0], isUsed: false}],
        [{varMultipliers: [1, 1, 1, 1], isUsed: false}]
      ]
    }
    let res = canBeFurtherSimplified(termTable);
    expect(res).toBe(true);
  })
  it("can not be further be simplified", () => {
    let termTable: MintermTable = {
      essentialTerms:[],
      mintermGrouping: [
        [],
        [],
        [{varMultipliers: [1, 1, 0, 0], isUsed: false}],
        [{varMultipliers: [1, 0, 0, 1], isUsed: false}],
        []
      ]
    }
    let res = canBeFurtherSimplified(termTable);
    expect(res).toBe(false);
  })
  it("should insert into minterm table properly", () => {
    let mintermTable: MintermTable = {mintermGrouping: [], essentialTerms:[]};
    insertIntoMintermTable(mintermTable, {varMultipliers: [1, 1, 1, 1], isUsed: false})
    expect(mintermTable.mintermGrouping.length).toBe(5)
    expect(mintermTable.mintermGrouping[4][0]).toEqual({varMultipliers: [1, 1, 1, 1], isUsed: false})
  })

  it("should find dominant primimplicants", () => {

    expect(findEssentialPrimimplicants([
      {values: [0, 0, 0, 0], result: 1},
      {values: [0, 0, 0, 1], result: 1},
      {values: [0, 1, 0, 0], result: 1},
      {values: [0, 1, 0, 1], result: 1},
      {values: [0, 1, 1, 0], result: 1},
      {values: [0, 1, 1, 1], result: 1},
      {values: [1, 0, 0, 0], result: 1},
      {values: [1, 0, 0, 1], result: 1},
      {values: [1, 0, 1, 1], result: 1},
      {values: [1, 1, 1, 1], result: 1}
    ],  [
        {varMultipliers: [1,0,2,1], isUsed: false},
        {varMultipliers: [2,1,1,1], isUsed: false},
        {varMultipliers: [1,2,1,1], isUsed: false},
        {varMultipliers: [0,2,0,2], isUsed: false},
        {varMultipliers: [2,0,0,2], isUsed: false},
        {varMultipliers: [0,1,2,2], isUsed: false}
      ]
    ).sort()).toEqual([
      {varMultipliers: [0,1,2,2], isUsed: false},
      {varMultipliers: [2,0,0,2], isUsed: false},
      {varMultipliers: [1,2,1,1], isUsed: false},
    ]);
  })
});
