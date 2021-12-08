

export function GetMintermCount(variableCount:number):number{
  return Math.pow(2,variableCount);
}

export function GetMintermVariables(variableCount:number):string[]{
  let output = new Array<string>();
  for(let i = 0; i<variableCount; i++){
    output.push(String.fromCharCode(i + 65));
  }
  return output;
}
