import { autobind } from "../decorator/auto-bind";
import { Draggable } from "../model/drag-drop";
import { Project } from "../model/project";
import { Component } from "./base-component";

export class ProjectItem
  extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable
{
  constructor(hostId: string, private projectItem: Project) {
    super("single-project", hostId, false, projectItem.id);
    this.configure();
    this.renderComponent();
  }
  get persons() {
    if (this.projectItem.people === 1) {
      return "1 person assigned";
    } else {
      return `${this.projectItem.people} persons assigned`;
    }
  }
  configure(): void {
    this.element.addEventListener("dragstart", this.dragStartHandler);
    this.element.addEventListener("dragend", this.dragEndHandler);
  }
  renderComponent(): void {
    this.element.querySelector("h2")!.innerText = this.projectItem.title;
    this.element.querySelector("h3")!.innerText = this.persons;
    this.element.querySelector("p")!.innerText = this.projectItem.description;
  }

  @autobind
  dragStartHandler(event: DragEvent) {
    event.dataTransfer!.setData("text/plain", this.projectItem.id);
    event.dataTransfer!.effectAllowed = "move";
  }
  @autobind
  dragEndHandler(_: DragEvent) {}
}
