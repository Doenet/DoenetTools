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
        isEditor,
        isAuthor,
      }?: {
        email?: string;
        firstNames?: string;
        lastNames?: string;
        isEditor?: boolean;
        isAuthor?: boolean;
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
        /**
         * Publish the content in the library.
         * Automatically make content public even if `makePublic` is false.
         * Requires that the logged in user is an editor.
         */
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
