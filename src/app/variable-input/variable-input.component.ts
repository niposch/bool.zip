import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.css']
})
export class VariableInputComponent implements OnInit {

  @Input()
  public possibleSelections: Array<LabelSelection> = new Array<LabelSelection>();

  @Output()
  public onChange = new EventEmitter<LabelSelection>();
  public currentIndex:number = 0;
  constructor() { }

  ngOnInit(): void {
    if(this.possibleSelections.length == 0){
      this.possibleSelections.push({label:"0", value:0})
      this.possibleSelections.push({label:"1", value:1})
      this.possibleSelections.push({label:"-", value:2})
    }
  }
  onClick(event:any){
    this.currentIndex += 1;
    if(this.currentIndex >= this.possibleSelections.length) this.currentIndex = 0;
  }
}

export interface LabelSelection {
  label: string;
  value: any;
}
