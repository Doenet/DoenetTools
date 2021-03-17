# Core Documentation

## Child Logic





## Serialized JSON

* children:[]
* componentType: ""
* doenetAttributed: {}
* props: {}
* variants: {}
* state: {}


## Doenet Attributes (from serialized json)

* componentName: \`/${type}${num}\`


## Request Update Syntax

component to core

### updateTypes
* updateValue

        this.coreFunctions.requestUpdate({
          updateType: "updateValue",
          updateInstructions: [{
            componentName: this.componentName,
            stateVariable: "value",
            value: mathExpression,
          }]
        })

* updateRendererOnly

      this.coreFunctions.requestUpdate({
        updateType: "updateRendererOnly",
      });



## State Variables

* inverseDefinition - function or undefined
* fixed - boolean
* modifyIndirectly - boolean



## Dependency Types

* childStateVariables
* childIdentity
* stateVariable
* componentStateVariable
* parentStateVariable
* stateVariableResolved
* componentStateVariableComponentType
* componentIdentity
* doenetAttribute
* value
* serializedChildren
* variants
* potentialEssentialVariable
