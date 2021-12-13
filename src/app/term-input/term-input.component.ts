import { Component, OnInit } from '@angular/core';
import {term} from "../models/term";
import {GetMintermCount, GetMintermVariables} from "../helper/MintermHelper";
import {LabelSelection} from "../variable-input/variable-input.component";

@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent implements OnInit {

  public termList: {[varName: string]: number}[] = [];
  public variableCount:number = 3;
  public variableNames: string[] = [];
  public rowNames: string[] = [];
  constructor() {
    this.initializeComponent();
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
    this.initializeComponent();
  }

  initializeComponent():void{
    this.termList = [];
    let mintermCount = GetMintermCount(this.variableCount);
    this.variableNames = GetMintermVariables(this.variableCount);
    this.rowNames = [...this.variableNames, 'result', 'actions']
    this.termList.push(this.variableNames.reduce((prev, curr) => ({...prev, [curr]: 0}), {}));
  }

  removeTerm(term:{[varName: string]: number}){
    // TODO implement this
    console.log(term);
  }
  addNewTerm(){
    this.termList = [...this.termList,this.variableNames.reduce((prev, curr) => ({...prev, [curr]: 0}), {})];
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
    this.termList = [...this.termList];
  }
}
