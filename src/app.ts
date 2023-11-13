//Drag & Drop interfaces
interface Draggable {
  dragStartHandler(event: DragEvent): void;
  dragEndHandler(event: DragEvent) : void;
}

interface DragTarget{
  dragOverHandler(event: DragEvent): void;
  dropHandler(event: DragEvent): void;
  dragLeaveHandler(event: DragEvent): void;
}

enum ProjectStatus{
  Active, Finished
}

class Project {
  constructor(
    public id: string, 
    public title: string,
    public description: string,
    public people: number,
    public status: ProjectStatus ){
  }
}

type Listener<T> = (items: T[]) => void
class State<T> {
  protected listeners: Listener<T>[] = [];
  addListeners(listener : Listener<T>) {
    this.listeners.push(listener)
  }
}

class ProjectState extends State<Project>{
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

const project = ProjectState.getInstance()

interface validatable{
  value: string | number, 
  required?: boolean,
  minLength?: number,
  maxLength?: number,
  min?: number,
  max?: number
}
function validate(validateInput: validatable) : boolean{
  let isValid = true;
  if(validateInput.required) {
    isValid = isValid && validateInput.value.toString().trim().length !== 0
  }
  if(!!validateInput.minLength && typeof validateInput.value === 'string'){
    isValid = isValid && validateInput.value.trim().length >= validateInput.minLength
  }
  if(!!validateInput.maxLength && typeof validateInput.value === 'string'){
    isValid = isValid && validateInput.value.trim().length <= validateInput.maxLength
  }
  if(!!validateInput.min && typeof validateInput.value === 'number'){
    isValid = isValid && validateInput.value >= validateInput.min
  }
  if(!!validateInput.max && typeof validateInput.value === 'number'){
    isValid = isValid && validateInput.value <= validateInput.max
  }
  return isValid
}
function autobind(
  _: any,
  _2: string,
  descriptor: PropertyDescriptor
) {
  const originalMethod = descriptor.value;
  const adjDescriptor: PropertyDescriptor = {
    configurable: true,
    get() {
      const boundFn = originalMethod.bind(this);
      return boundFn;
    }
  }
  return adjDescriptor
}

abstract class Component<T extends HTMLElement, U extends HTMLElement>{
  templateElement: HTMLTemplateElement;
  hostElement: T;
  element: U;

  constructor(templateId: string, hostId: string, insertAtStart: boolean, newElementId?: string) {
    this.templateElement = document.getElementById(
      templateId
    )! as HTMLTemplateElement;
    this.hostElement = document.getElementById(hostId)! as T;

    const importedNode = document.importNode(
      this.templateElement.content,
      true
    );
    this.element = importedNode.firstElementChild as U;
    if(newElementId){
      this.element.id = newElementId;
    }

    this.attach(insertAtStart);
  }

  private attach(insertAtStart: boolean) {
    this.hostElement.insertAdjacentElement(insertAtStart ? 'afterbegin': 'beforeend',
     this.element);
  }

  // you cannot use private modifier on abstract method in TS
  abstract configure() : void
  abstract renderComponent() : void
}

class ProjectInput extends Component<HTMLDivElement, HTMLFormElement>{
  titleInputElement: HTMLInputElement;
  descriptionInputElement: HTMLInputElement;
  peopleInputElement: HTMLInputElement;

  constructor() {
    super('project-input', 'app', true, 'user-input')
    this.titleInputElement = this.element.querySelector('#title') as HTMLInputElement;
    this.descriptionInputElement = this.element.querySelector('#description') as HTMLInputElement;
    this.peopleInputElement = this.element.querySelector('#people') as HTMLInputElement;
    this.configure();
  }
  configure() {
    this.element.addEventListener('submit', this.submitHandler);
  }
  renderComponent(): void {
    
  }

  private gatherUserInpur(): [string, string, number] | void{
    const enteredTitle = this.titleInputElement.value;
    const enteredDesc = this.descriptionInputElement.value;
    const enteredPeople = +this.peopleInputElement.value;
    if(!validate({value: enteredTitle, 
      required: true,
      minLength: 2,
      maxLength: 10,
     }) ||
     !validate({value: enteredDesc, 
      required: true,
      minLength: 2,
      maxLength: 10,
     }) ||
    !validate({value: enteredPeople, 
      required: true,
      min: 1,
      max: 10,
       })){
      alert("Error")
    }
    return [enteredTitle, enteredDesc, enteredPeople]
  }

  @autobind
  private submitHandler(event: Event) {
    event.preventDefault();
    const inputs  = this.gatherUserInpur();
    if(Array.isArray(inputs)){
      const [title, description, noOfPeople] = inputs
      project.addProjects(title, description, noOfPeople)
    }
    
    this.titleInputElement.value = '';
    this.descriptionInputElement.value = '';
    this.peopleInputElement.value ='';
  }
}

class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
implements Draggable{
  constructor(hostId: string, private projectItem: Project){
    super('single-project', hostId, false, projectItem.id)
      this.configure()
      this.renderComponent()
    }
    get persons() {
      if(this.projectItem.people === 1){
        return '1 person assigned'
      }
       else {
        return `${this.projectItem.people} persons assigned`
       }
    }
    configure(): void {
      this.element.addEventListener('dragstart', this.dragStartHandler)
      this.element.addEventListener('dragend', this.dragEndHandler)
    }
    renderComponent(): void {
      this.element.querySelector('h2')!.innerText = this.projectItem.title
      this.element.querySelector('h3')!.innerText = this.persons
      this.element.querySelector('p')!.innerText = this.projectItem.description
    }

    @autobind
    dragStartHandler(event: DragEvent) {
      event.dataTransfer!.setData('text/plain', this.projectItem.id);
      event.dataTransfer!.effectAllowed = 'move'
    }
    @autobind
    dragEndHandler(_: DragEvent) {
     
    }
  }
  

class ProjectList extends Component<HTMLDivElement,  HTMLElement> implements DragTarget{
  assignedProjects: Project[] =[]

  constructor(private type: 'active' | 'finished') {
    super('project-list', 'app', false, `${type}-projects`)
    this.element.id = `${this.type}-projects`;
    this.renderComponent()
    this.configure()
  }
  renderComponent(): void {
    const listId = `${this.type}-projects-list`
    this.element.querySelector('h2')!.textContent =
     `${this.type.toUpperCase()} PROJECTS`
    this.element.querySelector('ul')!.id = listId
  }
  configure() {
    project.addListeners((projectList: Project[]) => { 
      const releventProject = projectList.filter((project: Project)=> {
        if(this.type === 'active'){
          return project.status === ProjectStatus.Active
        }
          return project.status === ProjectStatus.Finished
      })
      this.assignedProjects= releventProject
      this.renderProjects()
    })
    this.element.addEventListener('dragover', this.dragOverHandler)
    this.element.addEventListener('dragleave', this.dragLeaveHandler)
    this.element.addEventListener('drop', this.dropHandler)
  }

  @autobind
  dragOverHandler(event: DragEvent){
    if(event.dataTransfer && event.dataTransfer.types[0] ==='text/plain'){
      // by default html wont allow a element to draggable we need to set
      // event.preventDefault(); so it allowed to drag and dropable
      event.preventDefault();
      
      const listEl = this.element.querySelector('ul')!
      listEl.classList.add('droppable')
    }
    
  }

  @autobind
  dropHandler(event: DragEvent){
    const prjId = event.dataTransfer?.getData('text/plain')!
    project.moveProject(prjId, 
      this.type === 'active'?
       ProjectStatus.Active : ProjectStatus.Finished)
  }

  @autobind
  dragLeaveHandler(_: DragEvent){
    const listEl = this.element.querySelector('ul')!
    listEl.classList.remove('droppable')
  }
  private renderProjects(){
    const listEl =  document.getElementById(`${this.type}-projects-list`) as HTMLUListElement
    listEl.innerHTML = ''
    this.assignedProjects.forEach((project: Project) => new ProjectItem(`${this.type}-projects-list`, project)
    )
  }
  
}

const prjInput = new ProjectInput();
const prjList = new ProjectList('active');
const prjList1 = new ProjectList('finished');
