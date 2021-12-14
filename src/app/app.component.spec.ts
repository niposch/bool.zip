import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {Minterm} from "./quine-mccluskey/models/minterm";
import {areCombineable, groupMinterms} from "./quine-mccluskey/Simplifier";
import {expect} from "@angular/flex-layout/_private-utils/testing";

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  });

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
  it("minterms should be grouped", ()=>{
    let minterms = new Array<Minterm>();
    minterms.push({varMultipliers:[1,0,1,0],isUsed:false})
    minterms.push({varMultipliers:[0,1,1,0],isUsed:false})
    minterms.push({varMultipliers:[1,1,0,0],isUsed:false})
    let groupedMinterms = groupMinterms(minterms);
    expect(groupedMinterms.mintermGrouping.length).toBe(3)
    expect(groupedMinterms.mintermGrouping[2].length).toBe(3)
    expect(groupedMinterms.mintermGrouping[0].length).toBe(0)
    expect(groupedMinterms.mintermGrouping[1].length).toBe(0)

  })
  it("using diffrent minterms should work", ()=>{
    let minterms = new Array<Minterm>();
    minterms.push({varMultipliers:[1,0,1,0],isUsed:false})
    minterms.push({varMultipliers:[0,1,1,0],isUsed:false})
    minterms.push({varMultipliers:[1,1,0,0],isUsed:false})
    minterms.push({varMultipliers:[1,1,1,0],isUsed:false})
    minterms.push({varMultipliers:[0,1,1,1],isUsed:false})
    let groupedMinterms = groupMinterms(minterms);
    expect(groupedMinterms.mintermGrouping.length).toBe(4)
    expect(groupedMinterms.mintermGrouping[2].length).toBe(3)
    expect(groupedMinterms.mintermGrouping[3].length).toBe(2)
    expect(groupedMinterms.mintermGrouping[0].length).toBe(0)
    expect(groupedMinterms.mintermGrouping[1].length).toBe(0)

  })
  it("grouping minterms should work", ()=>{
    let termA:Minterm = {varMultipliers:[1,1,1,0], isUsed: false}
    let termB:Minterm = {varMultipliers:[1,1,1,0], isUsed: false}
    expect(areCombineable(termA,termB)).toBe(true);
  })
  it("grouping minterms with 1 var diffrent should work", ()=>{
    let termA:Minterm = {varMultipliers:[1,1,0,0], isUsed: false}
    let termB:Minterm = {varMultipliers:[1,1,1,0], isUsed: false}
    expect(areCombineable(termA,termB)).toBe(true);
  })
  it("grouping minterms should not work", ()=>{
    let termA:Minterm = {varMultipliers:[1,0,1,0], isUsed: false}
    let termB:Minterm = {varMultipliers:[1,1,0,1], isUsed: false}
    expect(areCombineable(termA,termB)).toBe(false);
  })

});
