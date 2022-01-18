import CompositeComponent from './abstract/CompositeComponent';
import { LoremIpsum } from "lorem-ipsum";
import { processAssignNames } from '../utils/serializedStateProcessing';

export default class Lorem extends CompositeComponent {
  static componentType = "lorem";

  static assignNamesToReplacements = true;

  static stateVariableToEvaluateAfterReplacements = "readyToExpandWhenResolved";


  static createAttributesObject(args) {
    let attributes = super.createAttributesObject(args);

    attributes.minSentencesPerParagraph = {
      createComponentOfType: "number",
      createStateVariable: "minSentencesPerParagraph",
      defaultValue: 4,
      public: true,
    };

    attributes.maxSentencesPerParagraph = {
      createComponentOfType: "number",
      createStateVariable: "maxSentencesPerParagraph",
      defaultValue: 8,
      public: true,
    };

    attributes.minWordsPerSentence = {
      createComponentOfType: "number",
      createStateVariable: "minWordsPerSentence",
      defaultValue: 4,
      public: true,
    };

    attributes.maxWordsPerSentence = {
      createComponentOfType: "number",
      createStateVariable: "maxWordsPerSentence",
      defaultValue: 8,
      public: true,
    };

    attributes.generateWords = {
      createComponentOfType: "number",
      createStateVariable: "generateWords",
      defaultValue: null,
    };

    attributes.generateSentences = {
      createComponentOfType: "number",
      createStateVariable: "generateSentences",
      defaultValue: null,
    };

    attributes.generateParagraphs = {
      createComponentOfType: "number",
      createStateVariable: "generateParagraphs",
      defaultValue: null,
    };

    return attributes;
  }


  static returnStateVariableDefinitions() {

    let stateVariableDefinitions = super.returnStateVariableDefinitions();


    stateVariableDefinitions.readyToExpandWhenResolved = {
      returnDependencies: () => ({
        minSentencesPerParagraph: {
          dependencyType: "stateVariable",
          variableName: "minSentencesPerParagraph"
        },
        maxSentencesPerParagraph: {
          dependencyType: "stateVariable",
          variableName: "maxSentencesPerParagraph"
        },
        minWordsPerSentence: {
          dependencyType: "stateVariable",
          variableName: "minWordsPerSentence"
        },
        maxWordsPerSentence: {
          dependencyType: "stateVariable",
          variableName: "maxWordsPerSentence"
        },
        generateWords: {
          dependencyType: "stateVariable",
          variableName: "generateWords"
        },
        generateSentences: {
          dependencyType: "stateVariable",
          variableName: "generateSentences"
        },
        generateParagraphs: {
          dependencyType: "stateVariable",
          variableName: "generateParagraphs"
        },
      }),
      markStale: () => ({ updateReplacements: true }),
      definition() {
        return { setValue: { readyToExpandWhenResolved: true } };
      },
    };


    return stateVariableDefinitions;

  }


  static async createSerializedReplacements({ component, componentInfoObjects }) {

    const lorem = new LoremIpsum({
      sentencesPerParagraph: {
        max: await component.stateValues.maxSentencesPerParagraph,
        min: await component.stateValues.minSentencesPerParagraph
      },
      wordsPerSentence: {
        max: await component.stateValues.maxWordsPerSentence,
        min: await component.stateValues.minWordsPerSentence
      },
      random: component.sharedParameters.rng
    });

    let replacements = [];

    if (await component.stateValues.generateParagraphs !== null) {

      let numParagraphs = await component.stateValues.generateParagraphs;
      if (Number.isInteger(numParagraphs) && numParagraphs > 0) {

        let paragraphs = lorem.generateParagraphs(numParagraphs).split("\n");

        replacements = paragraphs.map(x => ({
          componentType: "p",
          children: [x]
        }))
      }

    } else if (await component.stateValues.generateSentences !== null) {

      let numSentences = await component.stateValues.generateSentences;
      if (Number.isInteger(numSentences) && numSentences > 0) {

        let sentences = lorem.generateSentences(numSentences).split(". ");

        for (let sent of sentences.slice(0, sentences.length - 1)) {
          replacements.push({
            componentType: "text",
            children: [sent + "."]
          })
          replacements.push(" ")
        }

        replacements.push({
          componentType: "text",
          children: [sentences[sentences.length - 1]]
        })
      }

    } else if (await component.stateValues.generateWords !== null) {

      let numWords = await component.stateValues.generateWords;

      if (Number.isInteger(numWords) && numWords > 0) {

        let words = lorem.generateWords(numWords).split(" ").map(w => ({
          componentType: "text",
          children: [w]
        }));

        replacements.push(words[0]);

        for (let w of words.slice(1)) {
          replacements.push(" ")
          replacements.push(w)
        }

      }
    }


    let newNamespace = component.attributes.newNamespace && component.attributes.newNamespace.primitive;

    let processResult = processAssignNames({
      assignNames: component.doenetAttributes.assignNames,
      serializedComponents: replacements,
      parentName: component.componentName,
      parentCreatesNewNamespace: newNamespace,
      componentInfoObjects,
    });

    return { replacements: processResult.serializedComponents };

  }


  static async calculateReplacementChanges({ component, componentInfoObjects }) {

    let replacements = (await this.createSerializedReplacements({ component, componentInfoObjects }))

    let replacementInstruction = {
      changeType: "add",
      changeTopLevelReplacements: true,
      firstReplacementInd: 0,
      numberReplacementsToReplace: component.replacements.length,
      serializedReplacements: replacements.replacements,
    };

    return [replacementInstruction];

  }

}
