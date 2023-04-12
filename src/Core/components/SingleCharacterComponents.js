import SingleCharacterInline from './abstract/SingleCharacterInline';


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

export class Lq extends SingleCharacterInline {
  static componentType = "lq";
  static unicodeCharacter = "\u201c";
}

export class Rq extends SingleCharacterInline {
  static componentType = "rq";
  static unicodeCharacter = "\u201d";
}

export class Lsq extends SingleCharacterInline {
  static componentType = "lsq";
  static unicodeCharacter = "\u2018";
}

export class Rsq extends SingleCharacterInline {
  static componentType = "rsq";
  static unicodeCharacter = "\u2019";
}