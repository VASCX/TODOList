import { Component, inject, OnInit,ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {IonButton,IonButtons,IonContent,IonHeader,IonInput,IonItem,IonModal,IonTitle,IonToolbar,IonDatetime, IonIcon } from '@ionic/angular/standalone';
import { OverlayEventDetail } from '@ionic/core/components';
import { DataService } from '../services/data.service';
import { HomePage } from '../home/home.page';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports:[FormsModule,IonButtons,IonContent,IonHeader,IonInput,IonItem,IonModal,IonTitle,IonToolbar,IonButton],
})

export class AddTaskComponent{
  @ViewChild(IonModal) modal!: IonModal;
  private dataService = inject(DataService);
  message = 'This modal example uses triggers to automatically open a modal when the button is clicked.';
  title!: string;
  description!: string;
  date!: string;
  category!:string;
  
  cancel(){
    this.modal.dismiss(null, 'cancel');
  }

  confirm() {
    if (this.title.length > 3 && this.description.length > 4 && this.category.length > 3 && this.date != undefined){
    DataService.prototype.save(this.title, this.description, this.category, this.date);
    this.modal.dismiss(this.title, 'confirm');
    } else if (this.title.length==0 && this.description.length == 0, this.category.length == 0, this.date == undefined) {
    } else if (this.title.length<=3) {
    } else if (this.description.length<=4){
    } else if (this.category.length <=3){
    } else if (this.date == undefined){
    }
  }


  onWillDismiss(event: CustomEvent<OverlayEventDetail>) {
      this.dataService.updateObs();
    }

  }
