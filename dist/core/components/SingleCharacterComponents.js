import SingleCharacterInline from './abstract/SingleCharacterInline.js';


export class Ndash extends SingleCharacterInline {
  static componentType = "ndash";
  static unicodeCharacter = "\u2013";

}

export class Mdash extends SingleCharacterInline {
  static componentType = "mdash";
  static unicodeCharacter = "\u2014";
}

export class NBSP extends SingleCharacterInline {
  static componentType = "nbsp";
  static unicodeCharacter = "\u00a0";

}

export class Ellipsis extends SingleCharacterInline {
  static componentType = "ellipsis";
  static unicodeCharacter = "\u2026";
}