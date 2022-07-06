// enter email on /signin to get signin code
// click button to get signin code
// get cookie device name

// new php request -- using emailid & device name
// return signin code
// enter password  and click signin
//goes to dashboard //TODO: signin now goes to course

import {signIn} from './DoenetSignin';
import {signOut} from './DoenetSignOut';

describe('Sign in', () => {
 it("signin successfully", () => {
   signIn();
   signOut();

   // signin and signout twice second time
   signIn();
   signOut();
 });
})