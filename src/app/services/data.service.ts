import { Injectable, Signal, signal,Output,EventEmitter,Component } from '@angular/core';
import { HomePage } from '../home/home.page';
import { BehaviorSubject } from 'rxjs';
import { CountdownConfig, CountdownModule, CountdownComponent } from 'ngx-countdown';
export interface task {
  toLowerCase(): unknown;
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;  
  state: boolean;
}



@Injectable({
  providedIn: 'root'
})
export class DataService {
  currentFilter: string = 'all';
  currentSearch: string = '';
  totalTasks: number = 0;
  remainingTasks: number = 0;
  completedTasks: number = 0;
  public tasks: task[] = [];

  tasksubjects = new BehaviorSubject<number>(0);
  Cont$= this.tasksubjects.asObservable();
  tasksubject = new BehaviorSubject<any>(null);
  tasks$ = this.tasksubject.asObservable();

  filtersubject = new BehaviorSubject<string>('all');
  filter$ = this.filtersubject.asObservable();
  
  
  
  async updateObs(){
    let data: any = localStorage.getItem('tasks');
    this.tasks = await JSON.parse(data);
    this.tasksubject.next(this.tasks);
    this.countTasks();
  }

  
  constructor() {
    this.filter$.subscribe((x)=>
      {
        this.currentFilter=x
      })
    this.updateObs();
    this.countTasks();
  }

  public save(title: string, desc: string, category:string, date:string) {
    let taskObj = JSON.parse(localStorage.getItem('tasks') || '[]');
    let maxId = this.indexOfMax(taskObj, 'id');
    let newId = maxId === -1 ? 0 : maxId + 1;

      taskObj.push({ id: newId, title: title, description: desc, category:category, date: date,  state: false});

    localStorage.setItem('tasks', JSON.stringify(taskObj));
    
}

  public getTasks(): task[] {
    return this.tasks;
  }

  public getTasksById(id: number): task | undefined {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    return tasks.find((task: task) => task.id === id);
  }

  
indexOfMax(arr: { [key: string]: any }[], property: string): number {
  if (arr.length === 0) {
    return -1;
  }

  let max = arr[0][property];
  let maxIndex = 0;

  for (let i = 1; i < arr.length; i++) {
    if (!arr[i].hasOwnProperty(property)) {
      throw new Error(`Property "${property}" does not exist in the objects.`);
    }

    if (arr[i][property] > max) {
      maxIndex = i;
      max = arr[i][property];
    }
  }

  return max;
}

async countTasks() {
  const completedTasksArray = this.tasks.filter((tasks) => tasks.state === true);
  this.totalTasks = this.tasks.length;
  this.completedTasks = completedTasksArray.length;
  this.remainingTasks = this.tasks.length - completedTasksArray.length;
  this.tasksubjects.next(this.totalTasks);
}
updateTaskState(task: task) {

  
  let tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  let index = tasks.findIndex((t: task) => t.id === task.id);

  if (index !== -1) {
    tasks[index].state = task.state;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    this.tasks = tasks;
    this.tasksubject.next(this.tasks); 
    this.SearchandFilterTasks(this.currentSearch, this.currentFilter);

  }
  this.countTasks();
}

getFilteredTasks(filter: string): task[] {
  this.currentFilter = filter;
  let result = this.tasks;
  
  switch (this.currentFilter) {
    case 'completed':
      result = result.filter(task => task.state === true);
      break;
    case 'remaining':
      result = result.filter(task => task.state === false);
      break;
  }
  
  this.tasksubject.next(result);
  return result;
}

getSearchedTasks(query: string): task[] {
  if (!query) {
    return this.tasks; 
  }
  return this.tasks.filter(task => 
    task.title.toLowerCase().includes(query.toLowerCase())
  );
}

SearchandFilterTasks(title: string, filter: string): task[] {
  let filteredTasks = this.tasks;
  if (filter === 'completed') {
    filteredTasks = filteredTasks.filter(task => task.state === true);
  } else if (filter === 'remaining') {
    filteredTasks = filteredTasks.filter(task => task.state === false);
  }
  if (title) {
    filteredTasks = filteredTasks.filter(task => 
      task.title.toLowerCase().includes(title.toLowerCase())
    );
  }
  this.tasksubject.next(filteredTasks);
  return filteredTasks;
}

FiltersFunction(title: string, filter: string): task[] {
  let result = this.tasks;

  this.filtersubject.next(filter);

  

  if (filter && filter !== 'all') {
    if (filter === 'completed') {
      result = result.filter(task => task.state === true);
    } else if (filter === 'remaining') {
      result = result.filter(task => task.state === false);
    }
  }


  if (title) {
    result = result.filter(task => 
      task.title.toLowerCase().includes(title.toLowerCase())
    );
  }

  

  this.tasksubject.next(result);
  
  return result;
}
editTask(id:number,editedTask:String,editedCat:String,editedDesc:String, editedDate:string){
    let editObj = JSON.parse(localStorage.getItem('tasks') || '[]');
    let numind = editObj.findIndex((findtask: { id: number }) => findtask.id === id);
    editObj[numind].title = editedTask;
    editObj[numind].date = editedDate;
    editObj[numind].category= editedCat;
    editObj[numind].description= editedDesc;
    localStorage.removeItem('tasks');
    localStorage.setItem('tasks', JSON.stringify(editObj));
    this.updateObs();
    this.countTasks();
}
getCountdownConfig(dateString: string): CountdownConfig {
    
  const deadlineTime = new Date(dateString).getTime(); 
  const now = new Date().getTime(); 
  const leftTime = Math.floor((deadlineTime - now) / 1000); 

 
  if (leftTime < 0) {
    return { leftTime: 0, format: 'HH:mm:ss' }; 
  }

  const daysLeft = Math.floor(leftTime / 86400);
  const format = daysLeft > 0 ? 'dd:HH:mm:ss' : 'HH:mm:ss';

  return {
    leftTime: leftTime,
    format: format,
  };
}

deleteTask(i: number) {
  const tasks: task[] = JSON.parse(localStorage.getItem('tasks') || '[]');
  
  const updatedTasks = tasks.filter((task: task) => task.id !== i);
  
  localStorage.setItem('tasks', JSON.stringify(updatedTasks));
  this.updateObs();
}

}