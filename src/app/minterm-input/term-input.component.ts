import { Component, OnInit } from '@angular/core';
import {term} from "../models/term";
import {GetMintermCount, GetMintermVariables} from "../helper/MintermHelper";

@Component({
  selector: 'app-term-input',
  templateUrl: './term-input.component.html',
  styleUrls: ['./term-input.component.css']
})
export class TermInputComponent implements OnInit {

  public termList:term[];
  public variableCount:number = 3;
  public variableNames: string[];
  constructor() {
    this.termList = new Array<term>();
    this.variableNames = new Array<string>();
    this.initializeComponent();
  }

  ngOnInit(): void {
  }
  variableCountChanged(event:Event):void{
    const input = event.target as HTMLInputElement;
    this.variableCount = parseInt(input.value);
    this.initializeComponent();
  }

  initializeComponent():void{
    this.termList = new Array<term>();
    let mintermCount = GetMintermCount(this.variableCount);
    this.termList.push(new term(this.variableCount));
    this.variableNames = GetMintermVariables(this.variableCount);
  }

  removeTerm(termToRemove:term){
    this.termList = this.termList.filter(term => term != termToRemove)
  }
  addNewTerm(){
    this.termList.push(new term(this.variableCount))
  }
}
