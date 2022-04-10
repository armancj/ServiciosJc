import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CropperImgComponent } from './cropper-img.component';
import { AngularCropperjsModule } from 'angular-cropperjs';
import { MaterialModule } from 'src/app/material/material.module';



@NgModule({
  declarations: [CropperImgComponent],
  imports: [
    CommonModule,
    AngularCropperjsModule, 
    MaterialModule  
  ],
  exports:[CropperImgComponent]
})
export class CropperImgModule { }
