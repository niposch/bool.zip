

// einzelne Zeile einer Ausgangstabelle
export class term {
  public values:number[]
  public result:number;
  constructor(varCount:number) {
    this.values = new Array<number>();
    for (let i = 0; i<varCount; i++){
      (this as any)[i] = 0;
    }
    this.result = 0;
  }
}
