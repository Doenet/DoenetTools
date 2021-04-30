import BaseComponent from './abstract/BaseComponent';

export default class Meta extends BaseComponent {

  static componentType = "meta";

  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    return attributes;
    
    // TODO: changed how isArray works to be like normal state variables
    // determine how to handle this situation of allowing multiple children
    return { keywords: {isArray: true, singularName: "keyword"} };
  }

  


}
