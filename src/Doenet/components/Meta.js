import BaseComponent from './abstract/BaseComponent';

export default class Meta extends BaseComponent {

  static componentType = "meta";

  static createPropertiesObject() {

    return { keywords: {isArray: true, singularName: "keyword"} };
  }

  


}
