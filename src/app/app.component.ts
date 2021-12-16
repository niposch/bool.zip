import {Component, OnInit} from '@angular/core';
import {Term} from "./models/term";
import {simplify} from "./quine-mccluskey/Simplifier";
import {Minterm} from "./quine-mccluskey/models/minterm";
import {GetMintermVariables} from "./helper/MintermHelper";
import {InputTerm} from "./term-input/term-input.component";
import {DomSanitizer} from "@angular/platform-browser";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'GTIEinreichung';
  public variableCount = 4;
  public primeImplicantTable:Array<InputTerm> = new Array<InputTerm>();
  public output:string[] = new Array<string>();
  public variableNames:Array<string> = new Array<string>();
  public terms:Term[] = new Array<Term>();
  public termType:boolean = true; // true=> all 1, false => all 0 terms
  changeTermType(){
    this.termType = !this.termType;
  }
  public variableCountChanged(event:Event){
    let input = event.target as HTMLInputElement;
    this.variableCount = parseInt(input.value)
    if(this.variableCount > 26){
      this.variableCount = 26;
      input.value = "26";
    }
  }
  constructor(public sanitizer: DomSanitizer) {
  }
  ngOnInit() {
  }

  termChanged(newTerms:Term[]){
    this.terms = newTerms;
    let primImplicants = simplify(newTerms, 1);
    this.variableNames = GetMintermVariables(this.variableCount);
    this.output = []
    for(let i = 0; i<primImplicants.length; i++){
      if(primImplicants[i].varMultipliers.every(v => v == 2)){
        this.output.push("1 +")
      }
      else{
        this.output.push(primImplicants[i].varMultipliers.map((v, index) => {
          if(v == 0) {
            return "!" + this.variableNames[index] + " *"
          }
          if(v == 1) {
            return this.variableNames[index] + " *"
          }
          if(v == 2) {
            return "";
          }
          return "";
        }).filter(el => el != "").join(" ").slice(0,-1) + ' +');
      }
    }
    if(this.output.length > 0){
      this.output[this.output.length - 1] = this.output[this.output.length - 1].slice(0,-2);
    }
    console.log(primImplicants);
  }
}
