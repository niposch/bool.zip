import {TestBed} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {Minterm, MintermTable} from "./quine-mccluskey/models/minterm";
import {
  areCombineable,
  canBeFurtherSimplified, findEssentialPrimimplicants,
  groupMinterms,
  insertIntoMintermTable, isTermCoveredByPrimimplicant, simplifyMintermTable
} from "./quine-mccluskey/Simplifier";
import {expect} from "@angular/flex-layout/_private-utils/testing";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });
})
describe("Simplifier Tests", () => {
  it("should simplify wikipedias minterm table by one", () => {

    const mintermTable: MintermTable = {
      mintermGrouping: [
        [{varMultipliers: [0, 0, 0, 0], isUsed: false}],
        [
          {varMultipliers: [0, 0, 0, 1], isUsed: false},
          {varMultipliers: [0, 1, 0, 0], isUsed: false},
          {varMultipliers: [1, 0, 0, 1], isUsed: false},
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

    let expectedIsUsedBools = [
      true,
      true,
      true,

      true,
      true,
      true,
      true,
      true,

      true,
      true,
      false,

      false,
      false
    ]
    const mintermTable: MintermTable = {
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
    const expectedSimplifiedTable: MintermTable = {
      mintermGrouping:
        [
          [
            {varMultipliers: [0, 2, 0, 2], isUsed: false},
            {varMultipliers: [2, 0, 0, 2], isUsed: false},
          ],
          [
            {varMultipliers: [0, 1, 2, 2], isUsed: false},
          ],
        ]
    }
    const simplifiedMintermTable = simplifyMintermTable(mintermTable);
    mintermTable.mintermGrouping.flat().forEach((el,index) => expect(el.isUsed).toBe(expectedIsUsedBools[index]))
    simplifiedMintermTable.mintermGrouping.flat().forEach(el => expect(el.isUsed).toBe(false))
    simplifiedMintermTable.mintermGrouping.forEach((grouping, index) => {
      expect(expectedSimplifiedTable.mintermGrouping[index]
        .some(
          (minTerm, mintermIndex) => minTerm.varMultipliers.toString() === expectedSimplifiedTable.mintermGrouping[index][mintermIndex].varMultipliers.toString()
        )).toBe(true);
    })
  })
});
describe("Simplifier Helper", () => {
  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'GTIEinreichung'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('GTIEinreichung');
  });
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
    let mintermTable: MintermTable = {mintermGrouping: []};
    insertIntoMintermTable(mintermTable, {varMultipliers: [1, 1, 1, 1], isUsed: false})
    expect(mintermTable.mintermGrouping.length).toBe(5)
    expect(mintermTable.mintermGrouping[4][0]).toEqual({varMultipliers: [1, 1, 1, 1], isUsed: false})


  })

  it("should find dominant primimplicants", () => {
    findEssentialPrimimplicants([
      {
        values: [1, 0, 0, 0],
        result: 1
      },
      {
        values: [1, 0, 0, 1],
        result: 1
      },
      {
        values: [0, 0, 0, 1],
        result: 1
      }
    ], {
      mintermGrouping: [
        [{varMultipliers: [2, 0, 0, 2], isUsed: false}],
        [{varMultipliers: [2, 0, 0, 1], isUsed: false}],
        [{varMultipliers: [2, 0, 2, 1], isUsed: false}]
      ]
    });
  })
});
