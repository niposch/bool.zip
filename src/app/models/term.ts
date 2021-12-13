
// einzelne Zeile einer Ausgangstabelle
export class term {
  public values:boolean[]
  public result:boolean;
  constructor(varCount:number) {
    this.values = new Array<boolean>();
    for (let i = 0; i<varCount; i++){
      this.values.push(false);
    }
    this.result = false;
  }
}
