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
    }

    if (dataArray.length == 0) {
      console.log("No se pudo obtener información del archivo, intente de nuevo");
      return;
    }

    this.sociosService.updateCsvData(dataArray);

    this.router.navigate(['pages/dashboard']);

    // // console.log(this.socioService.getSociosFilter(dataArray, [{ column: 'nombre', operator: 'like', value: 'Fernando' }]).length);

    // // const racingPersons: Socio[] = this.socioService.getSociosFilter(dataArray, [{ column: 'equipo', operator: 'like', value: 'Racing' }]);

    // // console.log(this.socioService.getPromedioEdad(racingPersons));

    // // const filterThree: SocioFilter[] = [
    // //   {
    // //     column: 'estadoCivil',
    // //     operator: 'like',
    // //     value: 'casado'
    // //   },
    // //   {
    // //     column: 'nivelEstudios',
    // //     operator: 'like',
    // //     value: 'Universitario'
    // //   }
    // // ]

    // // const filterSocios: Socio[] = this.socioService.getSociosFilter(dataArray, filterThree);

    // // const orderSocios: Socio[] = this.socioService.orderArray(filterSocios, 'edad', 'asc').splice(0,100);

    // // console.log(orderSocios);

    // const fiveNames = this.socioService.getColumnCount(dataArray, 'nombre', 'desc').splice(0, 5);

    // console.log("FIVE NAMES");
    // console.log(fiveNames);

    // const teams = this.socioService.getColumnsValues(dataArray, 'equipo');

    // let teamData: TeamData[] = [];

    // teams.forEach(team => {
    //   const sociosTeam = this.socioService.getSociosFilter(dataArray, [{ column: 'equipo', operator: 'equal', value: team }]);
    //   const totalSociosTeam = sociosTeam.length;

    //   const edadesMinMax = this.socioService.getEdadMinAndMax(sociosTeam);
    //   const promedioEdad = this.socioService.getPromedioEdad(sociosTeam);

    //   teamData.push({
    //     equipo: team,
    //     cantidadSocios: totalSociosTeam,
    //     edadMinima: edadesMinMax.min,
    //     edadMaxima: edadesMinMax.max,
    //     promedioEdad: promedioEdad
    //   })
    // });

    // console.log("TEAM DATA");
    // console.table(this.socioService.orderArray(teamData, 'desc', 'cantidadSocios'));


    // Aquí puedes trabajar con el array de objetos según tus necesidades
  }

}
