import { Component, inject, OnInit  } from '@angular/core';
import { RefresherCustomEvent, IonItem, IonLabel, IonList, IonSearchbar } from '@ionic/angular';
import { DataService, task } from '../services/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage implements OnInit {
  totalTasks: number = 0;
  completedTasks: number = 0;
  remainingTasks: number = 0;
  public results: task[] = [];
  private dataService = inject(DataService);
  private subscription!: Subscription;
  filter = 'all';
  sortOption: string = 'asc';

  constructor() {
    this.dataService.updateObs();
  }

  ngOnInit(): void {
    this.subscription = this.dataService.tasks$.subscribe((tasks) => {
      this.results = tasks || [];
      this.sortTasks();
    });
    this.dataService.countTasks();

    
    this.subscription = this.dataService.tasks$.subscribe((x)=>
    {
    console.log(x);
    })
    
    this.subscription = this.dataService.filter$.subscribe((x)=>
      {
        this.filter=x
      })
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  onSortChange(event: any) {
    this.sortOption = event.detail.value;
    this.sortTasks();
  }

  sortTasks() {
    if (this.sortOption === 'asc') {
      this.results.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleA.localeCompare(titleB);
      });
    } else if (this.sortOption === 'desc') {
      this.results.sort((a, b) => {
        const titleA = a.title.toLowerCase();
        const titleB = b.title.toLowerCase();
        return titleB.localeCompare(titleA);
      });
    } else if (this.sortOption === 'closest') {
      this.results.sort((a, b) => {
        // Handle undefined deadlines (treat them as far in the future)
        const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        return dateA - dateB; // Closest first
      });
    } else if (this.sortOption === 'furthest') {
      this.results.sort((a, b) => {
        // Handle undefined deadlines (treat them as far in the future)
        const dateA = a.date ? new Date(a.date).getTime() : Number.MAX_SAFE_INTEGER;
        const dateB = b.date ? new Date(b.date).getTime() : Number.MAX_SAFE_INTEGER;
        return dateB - dateA; // Furthest first
      });
    }
  }

  refresh(ev: any) {
    setTimeout(() => {
      this.dataService.updateObs();
      (ev as RefresherCustomEvent).detail.complete();
    }, 300);
  }
  gettasks(): task[] {
    return this.dataService.getTasks();
  }

  changeF(filter: string) {
    this.dataService.currentFilter = filter;
    this.results = this.dataService.FiltersFunction(
      this.dataService.currentSearch,
      filter
    );
    this.sortTasks();
  }
  
  handleInput(event: Event) {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value?.toLowerCase() || '';
    this.dataService.currentSearch = query;
    this.results = this.dataService.FiltersFunction(this.dataService.currentSearch, this.filter);
    this.sortTasks();
  }
}