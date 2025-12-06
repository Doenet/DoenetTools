import { ContentType, UserInfo } from "@doenet-tools/client/src/types";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to automatically log in as a user with the given email and names
       */
      loginAsTestUser({
        email,
        firstNames,
        lastNames,
        isAdmin,
      }?: {
        email?: string;
        firstNames?: string;
        lastNames?: string;
        isAdmin?: boolean;
      }): Chainable<null>;

      /**
       * Custom command to create an activity for the logged in user
       */
      createContent({
        name,
        contentType,
        doenetML,
        classifications,
        makePublic,
        publishInLibrary,
        parentId,
      }: {
        name: string;
        contentType?: ContentType;
        doenetML?: string;
        classifications?: {
          systemShortName: string;
          category: string;
          subCategory: string;
          code: string;
        }[];
        makePublic?: boolean;
        publishInLibrary?: boolean;
        parentId?: string;
      }): Chainable<string>;

      /**
       * Custom command to get info on logged in user
       */
      getUserInfo(): Chainable<UserInfo>;
    }
  }
}
