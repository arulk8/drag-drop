
type Listener<T> = (items: T[]) => void
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListeners(listener : Listener<T>) {
    this.listeners.push(listener)
  }
}

export class ProjectState extends State<Project>{
  private projects : Project[] = [];
  public static instance: ProjectState;

  public static getInstance() {
    if(!ProjectState.instance) {
      ProjectState.instance = new ProjectState()
    }
    return ProjectState.instance
    
  }
 
  
  getProjectList() {
    return this.projects
  }
  addProjects(title : string, description: string, numOfPeople: number) {
    const newProject = new Project(
      Math.floor((Math.random() * 1000) + 1).toString(),
      title,
      description,
      numOfPeople,
      ProjectStatus.Active
    )
    // console.log(newProject)
    this.projects.push(newProject)
    this.updateListeners()
  }

  moveProject(projectId : string, newStatus: ProjectStatus){
    const project = this.projects.find(prj => prj.id === projectId)
    // console.log('moved', project, newStatus)
    if(project && project.status !== newStatus){
      project.status = newStatus
      this.updateListeners()
    }
  }

  private updateListeners() {
    for(const listenerFn of this.listeners){
      listenerFn(this.projects.slice())
    }
  }
}

export const project = ProjectState.getInstance()