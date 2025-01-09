import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgxFileDropEntry, NgxFileDropModule } from 'ngx-file-drop';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './file-drop.component.html',
  styleUrls: ['./file-drop.component.scss'],
  imports: [NgxFileDropModule], // นำเข้า Standalone Component โดยตรง
})
export class AppComponent {
  @Input() dropZoneLabel: string = 'Drop files here';
  @Input() acceptedFileTypes: string[] = [];
  @Input() buttonLabel: string = 'Browse Files';
  @Output() fileDropped = new EventEmitter<File[]>();
    public files: NgxFileDropEntry[] = [];
    
  dropped(files: NgxFileDropEntry[]): void {
    console.log('Files dropped:', files);
    //this.fileDropped.emit(files);
  }

  fileOver(event: any): void {
    console.log('File over:', event);
  }

  fileLeave(event: any): void {
    console.log('File leave:', event);
  }

}
