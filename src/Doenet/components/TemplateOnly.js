import BaseComponent from './abstract/BaseComponent';

export class Subsref extends BaseComponent {
  constructor(){
    throw Error("subsref tag can only be included in a template");
  }  
  static componentType = "subsref";

}

export class Subsindex extends BaseComponent {
  constructor(){
    throw Error("subsindex tag can only be included in a template");
  }  
  static componentType = "subsindex";

}

export class parentTemplate extends BaseComponent {
  constructor(){
    throw Error("parentTemplate tag can only be included in a template");
  }    
  static componentType = "parenttemplate";

}
