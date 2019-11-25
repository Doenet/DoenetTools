

export function textFromComponent({component, textClass}) {

  if(component.componentType === "string" || component instanceof textClass) {
    if(component.unresolvedState.value) {
      return {success: false, unresolved: true}
    }
    return {success: true, textValue: component.state.value};
  } else if(component.unresolvedState.text) {
    return {success: false, unresolved: true}
  }else if(typeof component.state.text === "string") {
    return {success: true, textValue: component.state.text};
  }else if(component.toText !== undefined) {
    let textValue = component.toText();
    if(typeof textValue === "string") {
      return {success: true, textValue: textValue};
    }
  }

  return {success: false, textValue: ""}
}