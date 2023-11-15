import { autobind } from "../decorator/auto-bind";
import { project } from "../state/project-state";
import { validate } from "../util/validator";
import { Component } from "./base-component";

export class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super("project-input", "app", true, "user-input");
    this.titleInputElement = this.element.querySelector(
      "#title"
    ) as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector(
      "#description"
    ) as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector(
      "#people"
    ) as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.element.addEventListener("submit", this.submitHandler);
  }
  renderComponent(): void {}

  private gatherUserInpur(): [string, string, number] | void {
    const enteredTitle = this.titleInputElement.value;
    const enteredDesc = this.descriptionInputElement.value;
    const enteredPeople = +this.peopleInputElement.value;
    if (
      !validate({
        value: enteredTitle,
        required: true,
        minLength: 2,
        maxLength: 10,
      }) ||
      !validate({
        value: enteredDesc,
        required: true,
        minLength: 2,
        maxLength: 10,
      }) ||
      !validate({ value: enteredPeople, required: true, min: 1, max: 10 })
    ) {
      alert("Error");
    }
    return [enteredTitle, enteredDesc, enteredPeople];
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputs = this.gatherUserInpur();
    if (Array.isArray(inputs)) {
      const [title, description, noOfPeople] = inputs;
      project.addProjects(title, description, noOfPeople);
    }

    this.titleInputElement.value = "";
    this.descriptionInputElement.value = "";
    this.peopleInputElement.value = "";
  }
}
