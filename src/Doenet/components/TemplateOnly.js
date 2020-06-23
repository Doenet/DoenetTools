import BaseComponent from './abstract/BaseComponent';

export class copyFromSubs extends BaseComponent {
  constructor(){
    throw Error("copyFromSubs tag can only be included in a template");
  }  
  static componentType = "copyFromSubs";

}

export class indexFromSubs extends BaseComponent {
  constructor(){
    throw Error("indexFromSubs tag can only be included in a template");
  }  
  static componentType = "indexFromSubs";

}

export class parentTemplate extends BaseComponent {
  constructor(){
    throw Error("parentTemplate tag can only be included in a template");
  }    
  static componentType = "parenttemplate";

}
