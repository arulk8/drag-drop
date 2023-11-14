import { autobind } from "../decorator/auto-bind.js";
import { DragTarget } from "../model/drag-drop.js";
import { Project, ProjectStatus } from "../model/project.js";
import { project } from "../state/project-state.js";
import { Component } from "./base-component.js";
import { ProjectItem } from "./project-item.js";

export class ProjectList
  extends Component<HTMLDivElement, HTMLElement>
  implements DragTarget
{
  assignedProjects: Project[] = [];

  constructor(private type: "active" | "finished") {
    super("project-list", "app", false, `${type}-projects`);
    this.element.id = `${this.type}-projects`;
    this.renderComponent();
    this.configure();
  }
  renderComponent(): void {
    const listId = `${this.type}-projects-list`;
    this.element.querySelector(
      "h2"
    )!.textContent = `${this.type.toUpperCase()} PROJECTS`;
    this.element.querySelector("ul")!.id = listId;
  }
  configure() {
    project.addListeners((projectList: Project[]) => {
      const releventProject = projectList.filter((project: Project) => {
        if (this.type === "active") {
          return project.status === ProjectStatus.Active;
        }
        return project.status === ProjectStatus.Finished;
      });
      this.assignedProjects = releventProject;
      this.renderProjects();
    });
    this.element.addEventListener("dragover", this.dragOverHandler);
    this.element.addEventListener("dragleave", this.dragLeaveHandler);
    this.element.addEventListener("drop", this.dropHandler);
  }

  @autobind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === "text/plain") {
      // by default html wont allow a element to draggable we need to set
      // event.preventDefault(); so it allowed to drag and dropable
      event.preventDefault();

      const listEl = this.element.querySelector("ul")!;
      listEl.classList.add("droppable");
    }
  }

  @autobind
  dropHandler(event: DragEvent) {
    const prjId = event.dataTransfer?.getData("text/plain")!;
    project.moveProject(
      prjId,
      this.type === "active" ? ProjectStatus.Active : ProjectStatus.Finished
    );
  }

  @autobind
  dragLeaveHandler(_: DragEvent) {
    const listEl = this.element.querySelector("ul")!;
    listEl.classList.remove("droppable");
  }
  private renderProjects() {
    const listEl = document.getElementById(
      `${this.type}-projects-list`
    ) as HTMLUListElement;
    listEl.innerHTML = "";
    this.assignedProjects.forEach(
      (project: Project) =>
        new ProjectItem(`${this.type}-projects-list`, project)
    );
  }
}
