import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { File } from '@app/interfaces/interfaces';

import { CropperComponent } from 'angular-cropperjs';




@Component({
  selector: 'app-cropper-img',
  templateUrl: './cropper-img.component.html',
  styleUrls: ['./cropper-img.component.scss']
})
export class CropperImgComponent implements OnInit {
  @Output() imgCropp = new EventEmitter<any>()
  @ViewChild('fileInput') fileInput;
  file: File = {data: null,inProgress: false,progress: 0}
  @ViewChild('angularCropper') public angularCropper: CropperComponent;
  imageUrl:string
  croppedresult:string
  config =  {
    ContainerWidth:800,
    ContainerHeight:800,
    minCanvasWidth: 0,
    minCanvasHeight: 0,   
    viewMode: 2,
    dragMode: 'move',
    aspectRatio:4/4,
    background: false,
    movable: true,
    rotatable: false,
    scalable: true,
    zoomable: true,
   
    checkCrossOrigin: true,
    center: true,
    modal: false,
  };
  
  constructor() { }
 
  ngOnInit(): void {
  }

  onSelectFile(){
    const fileBrowser = this.fileInput.nativeElement
   

    if(fileBrowser.files && fileBrowser.files[0]){
      const reader = new FileReader()
      reader.readAsDataURL(fileBrowser.files[0])
      reader.onload = () =>{
        this.imageUrl = reader.result as string
      }
    }
  }

  getCroppedImage(){  

    const fileBrowser = this.fileInput.nativeElement
   /* this.angularCropper.cropper.setData({
      width:395,height:395
    })*/
    
    this.angularCropper.cropper.getCroppedCanvas().toBlob((blob)=>{
    
     
    
      const reader = new FileReader()
      reader.readAsDataURL(blob)
      reader.onload = ()=>{
        this.croppedresult = reader.result as string
        const objurl = new File([this.dataToBlob(this.croppedresult)],fileBrowser.files[0].name,{type:`image/jpeg`})
       this.file.data = objurl
     
      
        this.imgCropp.emit(this.file)
      }
    }, 'image/jpeg',0.95)

   
  }

  zoomIn(){
    this.angularCropper.cropper.zoom(0.1)
    this.getCroppedImage()
  }

  zoomOut(){
    this.angularCropper.cropper.zoom(-0.1)
    this.getCroppedImage()
  }


  dataToBlob(dataUrl):Blob{
    const arr = dataUrl.split(',')
    const mime = arr[0].match(/:(.*?);/)[1]
    const bstr = atob(arr[1])
    let n = bstr.length
    const u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n]=bstr.charCodeAt(n)
    }

    return new Blob([u8arr],{type:mime})
  }


 

}
