import Text from './Text';
import nlp from 'compromise';

export default class Pluralize extends Text {
  static componentType = "pluralize";

  static createPropertiesObject(args) {
    let properties = super.createPropertiesObject(args);
    properties.pluralform = {default: undefined};
    properties.basedonnumber = {default: undefined};
    return properties;
  }


  updateState(args={}) {
    super.updateState(args);

    let text = nlp(this.state.value);

    let allwords = text.values().toNumber().all().terms().data();

    if(allwords.length === 0) {
      return;
    }

    let makePlural;
    if(this.state.basedonnumber !== undefined) {
      makePlural = this.numberDesignatesPlural(this.state.basedonnumber);
    }


    if(allwords.length === 1) {
      // if have just one word, assume it is the noun to pluralize

      // if didn't have basedOnNumber, make it plural
      if(makePlural === undefined) {
        makePlural = true;
      }

      if(!makePlural) {
        return;
      }
      // if have pluralForm, the one word should be turned into the pluralForm
      if(this.state.pluralform !== undefined) {
        this.state.value = this.state.pluralform;
        return;
      } else {
        // attempt to pluralize via nlp
        this.state.value = text.nouns().toPlural().all().out('text');
        return;
      }
    }


    // have more than one word
    // if don't have basedOnNumber, look for numbers before nouns to determine if plurals
    if(makePlural === undefined) {

      // find indices in allwords of nouns and values
      let nounIndices = [];
      let valueIndices = [];

      let nouns = text.nouns().data();

      for(let [ind, word] of allwords.entries()) {
        let nextNoun = nouns[nounIndices.length];

        if(word.tags.includes("Value")) {
          valueIndices.push(ind);
        }
        if(nextNoun !== undefined && nextNoun.main === word.normal) {
          nounIndices.push(ind);
        }
      }

      // specify make plural by each noun.
      // use the value immediately preceeding
      makePlural = [];

      let numbers = text.values().numbers();

      let lastValueInd = -1;
      for(let ind of nounIndices) {
        while(Number(valueIndices[lastValueInd+1]) < Number(ind)) {
          lastValueInd++;
        }

        if(numbers[lastValueInd] === 1) {
          makePlural.push(false);
        }else {
          makePlural.push(true);
        }
      }

    }

    if(makePlural !== false) {
      // not sure why have to create new text for this to work
      let text2= nlp(this.state.value);

      if(this.state.pluralform !== undefined) {

        // replace all nouns with plural form
        for(let [ind, nounObj] of text.nouns().data().entries()) {
          if(makePlural === true || makePlural[ind] === true) {
            text2.replace(nounObj.main, this.state.pluralform);
          }
        }
      } else {

        let numNouns = text.nouns().data().length;
        for(let ind = 0; ind < numNouns; ind++) {
          if(makePlural === true || makePlural[ind] === true) {
            text2.nouns(ind).toPlural().all();
          }
        }
      }
      this.state.value = text2.out('text');

    }

  }

  numberDesignatesPlural(num) {
    return num !== 1;
  }

}