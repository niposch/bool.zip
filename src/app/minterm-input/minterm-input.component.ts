import { Component, OnInit } from '@angular/core';
import {Minterm} from "../models/minterm";
import {GetMintermCount, GetMintermVariables} from "../helper/MintermHelper";

@Component({
  selector: 'app-minterm-input',
  templateUrl: './minterm-input.component.html',
  styleUrls: ['./minterm-input.component.css']
})
export class MintermInputComponent implements OnInit {

  public mintermList:Minterm[];
  public variableCount:number = 3;
  public variableNames: string[];
  constructor() {
    this.mintermList = new Array<Minterm>();
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
    this.mintermList = new Array<Minterm>();
    let mintermCount = GetMintermCount(this.variableCount);
    this.mintermList.push(new Minterm(this.variableCount));
    this.variableNames = GetMintermVariables(this.variableCount);
  }

  removeTerm(termToRemove:Minterm){
    this.mintermList = this.mintermList.filter(term => term != termToRemove)
  }
  addNewTerm(){
    this.mintermList.push(new Minterm(this.variableCount))
  }
}
