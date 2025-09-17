export function call(str){
    return /^(\*)(\*)(.*)\*$/.test(str);
  }
export function replace(str){
    return str.replace(/^(\*)(\*)|(\*)$/g,'');
  }