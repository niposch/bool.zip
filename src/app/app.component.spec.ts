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
})
