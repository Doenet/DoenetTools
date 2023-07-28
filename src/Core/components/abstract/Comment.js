import BaseComponent from "./BaseComponent";

export default class Comment extends BaseComponent {
  static componentType = "_comment";
  static rendererType = undefined;

  static returnChildGroups() {
    let childGroups = [
      {
        group: "any",
        componentTypes: ["_base"],
      },
    ];

    return childGroups;
  }
}
