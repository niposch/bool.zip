import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-variable-input',
  templateUrl: './variable-input.component.html',
  styleUrls: ['./variable-input.component.css']
})
export class VariableInputComponent implements OnInit {
  public possibleSelections: Array<LabelSelection> = new Array<LabelSelection>();

  @Input()
  public currentIndex:number = 0;

  @Output()
  public currentIndexChange = new EventEmitter<number>();
  constructor() { }

  ngOnInit(): void {
    this.possibleSelections.push({label:"0", value:0})
    this.possibleSelections.push({label:"1", value:1})
    this.possibleSelections.push({label:"-", value:2})
  }
  onClick(event:any){
    console.log(event)
    this.currentIndex += 1;
    if(this.currentIndex >= this.possibleSelections.length) this.currentIndex = 0;
    this.currentIndexChange.emit(this.currentIndex);
  }
}

export interface LabelSelection {
  label: string;
  value: any;
}
