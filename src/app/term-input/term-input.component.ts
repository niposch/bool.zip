import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { GetMintermVariables } from "../helper/MintermHelper";

export interface Term {
  [varName: string]: number
}

@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent implements OnInit {

  @Output()
  public termList: Term[] = [];
  @Input()
  public variableCount:number = 3;
  @Output()
  public variableCountChange = new EventEmitter<number>();
  @Output()
  public variableNames: string[] = [];
  public rowNames: string[] = [];
  constructor() {
    this.initializeComponent();
  }

  onVarCountChange(event:any){

  }
  public termType:boolean = false; // true=> all 1, false => all 0 terms
  changeTermType(){
    this.termType = !this.termType;
  }
  ngOnInit(): void {
  }
  variableCountChanged(event:Event):void{
    const input = event.target as HTMLInputElement;
    this.variableCount = parseInt(input.value);
    this.variableNames = GetMintermVariables(this.variableCount);

    this.variableCountChange.emit(this.variableCount)

    this.rowNames = [...this.variableNames, 'result', 'actions'];
    const empty = this.createEmptyTerm();
    this.termList = this.termList.map((it) =>
      this.variableNames.reduce((prev, name) => {
        if(it[name])
          prev[name] = it[name];
        return prev;
      }, {...empty})
    );
  }

  initializeComponent():void{
    this.termList = [];
    this.variableNames = GetMintermVariables(this.variableCount);
    this.rowNames = [...this.variableNames, 'result', 'actions'];
    this.termList.push(this.createEmptyTerm());
  }

  removeTerm(term:{[varName: string]: number}){
    // TODO implement this
    console.log(term);
  }
  addNewTerm(){
    this.termList = [...this.termList, this.createEmptyTerm()];
  }

  createEmptyTerm(): Term {
    return this.variableNames.reduce((prev, curr) => ({...prev, [curr]: 0}), {});
  }

  sort(){
    this.termList.sort((a, b) => {
      for (const name of this.variableNames) {
        const diff = a[name] - b[name];
        if(diff){
          return diff;
        }
      }
      return 0;
    });

    let same = true;
    let i = 1;
    while (same) {
      for (; i < this.termList.length; i++) {
        same = true;
        for (const variableName of this.variableNames) {
          if (this.termList[i - 1][variableName] !== this.termList[i][variableName]) {
            same = false;
            break;
          }
        }
        if (same) {
          this.termList.splice(i);
          break;
        }
      }
    }

    this.termList = [...this.termList];
  }
}
