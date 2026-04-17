export type Visibility = "private" | "unlisted" | "public";

export interface AccessPolicy {
  visibility: Visibility;
}
