import { Component, inject, OnInit,ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform } from '@ionic/angular';
import {IonModal, IonHeader, IonButton,IonToolbar,IonButtons,IonTitle,IonContent,IonItem,IonInput,IonLabel,IonNote,IonBackButton, IonRefresher, IonRefresherContent } from '@ionic/angular/standalone';
import { Location } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, task } from '../services/data.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { DatePipe } from '@angular/common';
import { RefresherCustomEvent } from '@ionic/angular';

@Component({
  selector: 'app-view-message',
  templateUrl: './view-message.page.html',
  styleUrls: ['./view-message.page.scss'],
  imports:[FormsModule,IonButton,DatePipe, IonHeader, IonModal,IonToolbar,IonButtons,IonTitle,IonContent,IonItem,IonInput,IonLabel,IonNote,IonBackButton,IonRefresher, IonRefresherContent],
})

export class ViewMessagePage implements OnInit {
  @ViewChild('modal', { read: IonModal }) modal!: IonModal;
  @ViewChild('modalDelete', { read: IonModal }) modalDelete!: IonModal;
  public message!: task;
  private dataService = inject(DataService);
  private activatedRoute = inject(ActivatedRoute);
  private platform = inject(Platform);
  
  title: string = '';
  description: string = '';
  date: string = '';
  category: string = '';
 
  constructor(private location: Location) {}

  ngOnInit() {
    this.loadMessage();
  }

  private loadMessage() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      
      const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
      this.message = tasks.find((task: task) => task.id === parseInt(id, 10));
      
      if (this.message) {
        this.title = this.message.title;
        this.description = this.message.description;
        this.date = this.message.date;
        this.category = this.message.category;
        
      }
    }
  }

  refresh(ev: RefresherCustomEvent) {
    setTimeout(() => {
      this.loadMessage();
      ev.detail.complete();
    }, 300);
  }

  getBackButtonText() {
    return this.platform.is('ios') ? 'Inbox' : '';
  }

  cancelEdit() {
    this.modal.dismiss(null, 'cancel');
  }


  confirmEdit(id:number) {

    if (this.title.length > 3 && this.description.length > 4 && this.category.length > 3 && this.date != undefined){
      this.EditTask(id);
      this.modal.dismiss(this.title, 'confirm');
      location.reload();
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

   EditTask(id:number){
    this.dataService.editTask(id,this.title, this.category, this.description, this.date)
   }
   cancelDelete() {
    this.modalDelete.dismiss(null, 'cancel');
   
  }confirmDelete(id:number) {
      debugger;
      this.DeleteTask(id);
      this.modalDelete.dismiss(this.title, 'confirm');
      this.location.back();
  }
   DeleteTask(id:number){
    this.dataService.deleteTask(id);
   }
   onDeleteDismiss(event: CustomEvent<OverlayEventDetail>){
    this.dataService.updateObs();
  }
};