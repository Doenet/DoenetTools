/** The source for creating an activity */
export type ActivitySource = SingleDocSource | SelectSource | SequenceSource;

/** The source for creating a single doc activity */
export type SingleDocSource = {
  type: "singleDoc";
  id: string;
  title?: string;
  /**
   * If `isDescription` is `true`, then this activity is not considered one of the scored items
   * and its credit achieved is ignored.
   */
  isDescription: boolean;
  doenetML: string;
  /** The version of DoenetML that should be used to render this activity. */
  version: string;
  /** The number of variants present in `doenetML` */
  numVariants?: number;
  /** The number each component type among the base level children (direct children of document) in `doenetML` */
  baseComponentCounts?: Record<string, number | undefined>;
};

/** The source for creating a select activity */
export type SelectSource = {
  type: "select";
  id: string;
  title?: string;
  /** The child activities to select from */
  items: ActivitySource[];
  /** The number of child activities to select (without replacement) for each attempt */
  numToSelect: number;
  /**
   * Whether or not to consider each variant of each child a separate option to select from.
   * If `selectByVariant` is `true`, the selection is from the total set of all variants,
   * meaning selection probabilities is weighted by the number of variants each child has,
   * and, if `numToSelect` > 1, a child could be selected multiple times for a given attempt.
   */
  selectByVariant: boolean;
};

/** The source for creating a sequence activity */
export type SequenceSource = {
  type: "sequence";
  id: string;
  title?: string;
  /** The child activities that form the sequence. */
  items: ActivitySource[];
  /** If `true`, randomly permute the item order on each new attempt. */
  shuffle: boolean;
  /**
   * Weights given to the credit achieved of each item
   * when averaging them to determine the credit achieved of the sequence activity.
   * Items missing a weight are given the weight 1.
   */
  creditWeights?: number[];
};

// type guards

export function isActivitySource(obj: unknown): obj is ActivitySource {
  return isSingleDocSource(obj) || isSelectSource(obj) || isSequenceSource(obj);
}

export function isSingleDocSource(obj: unknown): obj is SingleDocSource {
  const typedObj = obj as SingleDocSource;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typedObj.type === "singleDoc" &&
    typeof typedObj.id === "string" &&
    typeof typedObj.isDescription === "boolean" &&
    typeof typedObj.doenetML === "string" &&
    typeof typedObj.version === "string"
  );
}

export function isSelectSource(obj: unknown): obj is SelectSource {
  const typedObj = obj as SelectSource;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typedObj.type === "select" &&
    typeof typedObj.id === "string" &&
    typeof typedObj.numToSelect === "number" &&
    typeof typedObj.selectByVariant === "boolean" &&
    Array.isArray(typedObj.items) &&
    typedObj.items.every(isActivitySource)
  );
}

export function isSequenceSource(obj: unknown): obj is SequenceSource {
  const typedObj = obj as SequenceSource;
  return (
    typedObj !== null &&
    typeof typedObj === "object" &&
    typedObj.type === "sequence" &&
    typeof typedObj.id === "string" &&
    Array.isArray(typedObj.items) &&
    typedObj.items.every(isActivitySource) &&
    typeof typedObj.shuffle === "boolean" &&
    (typedObj.creditWeights === undefined ||
      (Array.isArray(typedObj.creditWeights) &&
        typedObj.creditWeights.every((weight) => typeof weight === "number")))
  );
}
