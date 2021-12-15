import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import { GetMintermVariables } from "../helper/MintermHelper";
import {Term} from "../models/term";

export interface InputTerm {
  [varName: string]: number
}

@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent implements OnInit{

  @Output()
  public termsChange = new EventEmitter<Term[]>();
  public termList: InputTerm[] = [];
  _variableCount = 0;
  @Input() set variableCount(newNumber:number){
    this._variableCount = newNumber;
    this.variableNames = GetMintermVariables(newNumber);
    this.variableCountChanged()
  }
  @Output()
  public variableNames: string[] = [];
  public rowNames: string[] = [];
  constructor() {
    this.initializeComponent();
  }

  onVarCountChange(event:any){

  }
  public termType:boolean = true;
  @Input()
  public set termsEvalueateTo(value:boolean){  // true=> all 1, false => all 0 terms
    this.termType = value;
  }
  @Output()
  public termsEvalueateToChange = new EventEmitter<boolean>(); // emits new result of all terms
  changeTermsResult(){
    // TODO uncommend if maxterms are supported
    //this.termType = !this.termType;
    //this.termsEvalueateToChange.emit(this.termType)
  }

  ngOnInit(): void {
    this.termDataChanged()
  }
  variableCountChanged():void{
    this.variableNames = GetMintermVariables(this._variableCount);

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

  termDataChanged(){
    this.termsChange.emit(this.termList.map(termListel => {
      let values = this.variableNames.map(name => termListel[name]as 0|1|2);
      return {values: values, result:0} as Term
    }))
  }
  initializeComponent():void{
    this.termList = [];
    this.variableNames = GetMintermVariables(this.variableCount);
    this.rowNames = [...this.variableNames, 'result', 'actions'];
    this.termList.push(this.createEmptyTerm());
  }

  removeTerm(termToRemove:{[varName: string]: number}){
    this.termList = this.termList.filter(term => term != termToRemove)
  }
  addNewTerm(){
    this.termList = [...this.termList, this.createEmptyTerm()];
    this.termDataChanged();
  }

  createEmptyTerm(): InputTerm {
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
/*
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
*/
    this.termList = [...this.termList];
  }
}
