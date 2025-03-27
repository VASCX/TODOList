import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CountdownModule } from 'ngx-countdown';
import { MessageComponent } from './message.component';

@NgModule({
  imports: [ CommonModule, FormsModule, IonicModule, RouterModule,CountdownModule],
  declarations: [MessageComponent],
  exports: [MessageComponent]
})
export class MessageComponentModule {}
