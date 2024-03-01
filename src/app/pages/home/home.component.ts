import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileItem, FileUploader } from 'ng2-file-upload';

import { SociosService } from '../services/socios.service';

import { Socio } from 'src/app/entities';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  uploader: FileUploader = new FileUploader({ url: '' });

  constructor(private sociosService: SociosService, private router: Router){}

  ngOnInit(): void {}

  openInputFile(){
    const fileUpload = document.getElementById('fileUpload') as HTMLInputElement;
    fileUpload.click();
  }

  uploadFile() {
    if(this.uploader.queue.length == 0){
      return;
    }
    const fileItem: FileItem = this.uploader.queue[0];
    const fileReader: FileReader = new FileReader();

    fileReader.onloadend = () => {
      const csvData: string = fileReader.result as string;
      this.parseCSV(csvData);
      this.uploader.clearQueue();
      this.uploader = new FileUploader({ url: '' });
    };

    fileReader.readAsText(fileItem._file);
  }

  parseCSV(csvData: string) {
    const info: string[] = csvData.split('\n');
    const dataArray: any[] = [];
    for (const data of info) {
      const row: string[] = data.split(';');
      try {
        if (row.length > 1) {
          const obj: Socio = {
            nombre: row[0].trim(),
            edad: Number(row[1].trim()),
            equipo: row[2].trim(),
            estadoCivil: row[3].trim(),
            nivelEstudios: row[4].trim(),
          }
          dataArray.push({ ...obj });
        }
      } catch (error) {
        console.log(`No se pudo parsear la infomarción: `, error);
      }
    }

    if (dataArray.length == 0) {
      console.log("No se pudo obtener información del archivo, intente de nuevo");
      return;
    }

    this.sociosService.updateCsvData(dataArray);

    this.router.navigate(['pages/dashboard']);
  }

}
