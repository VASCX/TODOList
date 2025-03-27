import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit} from '@angular/core';
import { Platform,IonCheckbox,IonicModule} from '@ionic/angular';
import { DataService, task  } from '../services/data.service';
import { CountdownConfig, CountdownModule, CountdownComponent } from 'ngx-countdown';
@Component({
  selector: 'app-message',  
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss'],
  standalone: false,
  
})
export class MessageComponent implements OnInit{
  private platform = inject(Platform);
  private dataService = inject(DataService);
  @Input() tasks?: task;
  isIos() {
    return this.platform.is('ios')
  }
  constructor(private cdr: ChangeDetectorRef){
    
  }
  StateChange(task: task){
    this.cdr.detectChanges();
      if (task) {
        task.state = !task.state; 
        
        this.dataService.updateTaskState(task);
        console.log('Task after update:', task); 
        
      }
    
  }
  Timer(dateString: string): CountdownConfig {
    const deadlineTime = new Date(dateString).getTime();
    const now = new Date().getTime();
    const leftTime = Math.floor((deadlineTime - now) / 1000);

  
    if (leftTime < 0) {
      return { leftTime: 0, format: 'HH:mm:ss' };
    }
  
    const daysLeft = Math.floor(leftTime / 86400);
    const format = daysLeft > 0 ? 'dd:HH:mm:ss' : 'HH:mm:ss';
    let lefteTime: number;

    if(leftTime > 86400){
       lefteTime = leftTime-86400;
    } else {
      lefteTime = leftTime;
    }
  
    return {
      
      leftTime: lefteTime,
      format: format,
    };
  }
  ngOnInit() {
    
  }
}
