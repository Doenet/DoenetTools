// Documentation on how to create a component
// that only inherits from another class without adding functionality
//
// Process
// 1. Duplicate this file and rename it to the component name and end it with .js 
//    place in the appropriate components directory
// 2. Edit the InheritedComponentClass, NewComponentClass and newcomponentname in this template 
// 3. In /src/Doenet/ComponentTypes.js , 
//     A. Import the NewComponentClass
//     B. Add NewComponentClass to the componentTypeArray
//

import InheritedComponentClass from './InheritedComponentClass';

export class NewComponentClass extends InheritedComponentClass {
    static componentType = "newcomponentname";
  }