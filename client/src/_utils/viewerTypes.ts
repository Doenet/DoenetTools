/** The source for creating an activity */
export type ActivitySource = SingleDocSource | SelectSource | SequenceSource;

/** The current state of an activity, including all descendants and attempts. */
export type ActivityState = SingleDocState | SelectState | SequenceState;

/**
 * The current state of an activity, where references to the source have been eliminated.
 *
 * Useful for saving to a database, as this extraneously information has been removed.
 */
export type ActivityStateNoSource =
  | SingleDocStateNoSource
  | SelectStateNoSource
  | SequenceStateNoSource;

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
};

/** The current state of a single doc activity, including all attempts. */
export type SingleDocState = {
  type: "singleDoc";
  id: string;
  parentId: string | null;
  source: SingleDocSource;
  /** Used to seed the random number generate to yield the actual variants of each attempt. */
  initialVariant: number;
  /** Credit achieved (between 0 and 1) over all attempts of this activity */
  creditAchieved: number;
  attempts: SingleDocAttemptState[];
  /** See {@link RestrictToVariantSlice} */
  restrictToVariantSlice?: RestrictToVariantSlice;
};

/** The state of an attempt of a single doc activity. */
export type SingleDocAttemptState = {
  /** The variant selected for this attempt */
  variant: number;
  /** A json object containing the state need to reconstitute the activity */
  doenetState: unknown;
  /** Credit achieved (between 0 and 1) on this attempt */
  creditAchieved: number;
  /** The value of the question counter set for the beginning of this activity */
  initialQuestionCounter: number;
};

/**
 * The current state of a single doc activity, where references to the source have been eliminated.
 *
 * Useful for saving to a database, as this extraneously information has been removed.
 */
export type SingleDocStateNoSource = Omit<SingleDocState, "source">;

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

/** The current state of a select activity, including all attempts. */
export type SelectState = {
  type: "select";
  id: string;
  parentId: string | null;
  source: SelectSource;
  /** Used to seed the random number generate to yield the actual variants of each attempt. */
  initialVariant: number;
  /** Credit achieved (between 0 and 1) over all attempts of this activity */
  creditAchieved: number;
  /** The latest state of all possible activities that could be selected from. */
  latestChildStates: ActivityState[];
  attempts: SelectAttemptState[];
  /** See {@link RestrictToVariantSlice} */
  restrictToVariantSlice?: RestrictToVariantSlice;
};

/** The state of an attempt of a select activity. */
export type SelectAttemptState = {
  /** The activities that were selected for this attempt */
  activities: ActivityState[];
  /** Credit achieved (between 0 and 1) on this attempt */
  creditAchieved: number;
  /** The value of the question counter set for the beginning of this activity */
  initialQuestionCounter: number;
  /**
   * If `numToSelect` > 1 and a new attempt was created (via `generateNewSingleDocAttemptForMultiSelect`)
   * that replaced just one item and left the others unchanged,
   * then `singleItemReplacementIdx` gives the index of that one item that was replaced.
   */
  singleItemReplacementIdx?: number;
};

/**
 * The current state of a select activity, where references to the source have been eliminated.
 *
 * Useful for saving to a database, as this extraneously information has been removed.
 */
export type SelectStateNoSource = Omit<
  SelectState,
  "source" | "latestChildStates" | "attempts"
> & {
  latestChildStates: ActivityStateNoSource[];
  attempts: {
    activities: ActivityStateNoSource[];
    creditAchieved: number;
    initialQuestionCounter: number;
    singleItemReplacementIdx?: number;
  }[];
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

/** The current state of a sequence activity, including all attempts. */
export type SequenceState = {
  type: "sequence";
  id: string;
  parentId: string | null;
  source: SequenceSource;
  /** Used to seed the random number generate to yield the actual variants of each attempt. */
  initialVariant: number;
  /** Credit achieved (between 0 and 1) over all attempts of this activity */
  creditAchieved: number;
  /** The latest state of child activities, in their original order */
  latestChildStates: ActivityState[];
  attempts: SequenceAttemptState[];
  /** See {@link RestrictToVariantSlice} */
  restrictToVariantSlice?: RestrictToVariantSlice;
};

/** The state of an attempt of a sequence activity. */
export type SequenceAttemptState = {
  /** The activities as ordered for this attempt */
  activities: ActivityState[];
  /** Credit achieved (between 0 and 1) on this attempt */
  creditAchieved: number;
};

/**
 * The current state of a sequence activity, where references to the source have been eliminated.
 *
 * Useful for saving to a database, as this extraneously information has been removed.
 */
export type SequenceStateNoSource = Omit<
  SequenceState,
  "source" | "latestChildStates" | "attempts"
> & {
  latestChildStates: ActivityStateNoSource[];
  attempts: { activities: ActivityStateNoSource[]; creditAchieved: number }[];
};

/**
 * A description of how to restrict the variant of a given activity.
 *
 * The `numSlices` attribute indicates how many slices the variants were broken up into.
 * The (1-indexed) `idx` attribute indicate which slice of those `numSlices` slices this activity
 * is restricted to.
 *
 * The typical case is that `numSlices` equals the number of variants for this activity,
 * so each slice contains just a single variant.
 */
export type RestrictToVariantSlice = { idx: number; numSlices: number };
