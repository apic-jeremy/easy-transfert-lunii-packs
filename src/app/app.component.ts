import { Component, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';
import { ActiveToast, ToastrService } from 'ngx-toastr';
import { PackModel } from './model/pack.model';
import EventBus from 'vertx3-eventbus-client';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { debounceTime, forkJoin } from 'rxjs';
import { RepportMessageModel } from './model/repport.model';
import { DatePipe } from '@angular/common';
import { LuniiModel } from './model/lunii.model';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

const eb = new EventBus("http://localhost:8080/eventbus");

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  libraryPacksList: PackModel[] = [];
  filteredPacksList: PackModel[] = [];
  luniiPacksList: PackModel[] = [];
  rapportList: RepportMessageModel[] = [];
  loading: boolean = false;
  unknownPack: PackModel[] = [];
  currentToaster: ActiveToast<any> |undefined = undefined;
  lunii: LuniiModel |undefined = undefined;

  rapportForm: UntypedFormGroup = new UntypedFormGroup({
    nameFilter: new UntypedFormControl('')
  });

  filterValues = {
    name: "",
    showSelected: false,
    showDisabled: true,
  }
  
  constructor(private api: ApiService, private toastr: ToastrService, private datePipe: DatePipe, public dialog: MatDialog){
  }

  ngOnInit() {
    this.reload();

    this.rapportForm.controls['nameFilter'].valueChanges.pipe(debounceTime(300)).subscribe(v => {
      this.filterValues.name = v;
      this.filterPacks();
    })
  }

  filterPacks() {
    this.filteredPacksList = this.libraryPacksList.filter(p => {
      return (p.title.trim().toLowerCase().indexOf(this.filterValues.name.trim().toLowerCase()) !== -1) &&
            (this.filterValues.showSelected ? p.selected : true) &&
            (this.filterValues.showDisabled ? true : !p.disabled)
    });
  }

  changeSelectionAll(_check: boolean) {
    this.filteredPacksList.forEach(p => {
      p.selected = _check && !p.disabled;
      this.saveSelection(p.uuid, p.selected);
    });
    this.showSelectedChange(false);
  }

  reload() {
    this.loading = true;
    this.libraryPacksList = [];
    this.filteredPacksList = [];
    this.luniiPacksList = [];
    this.unknownPack = [];
    this.lunii = undefined;
    this.rapportLog("Chargement des packs...", "", MessageTypeEnum.reload);

    forkJoin([
      this.api.getLibraryPacks(),
      this.api.getLuniiPacks(),
      this.api.getLuniiInfo()
    ])
      .subscribe(
        ([libraryPacks, luniiPacks, luniiInfo]) => {
          this.lunii = luniiInfo;

          this.rapportLog(`${libraryPacks.length} packs`, "Chargement Librairie terminé", MessageTypeEnum.success);
          if(luniiInfo.plugged) {
            this.rapportLog(`${luniiPacks.length} packs`, "Chargement Lunii terminé", MessageTypeEnum.success);
          } else {
            this.rapportLog("Lunii non connectée", "", MessageTypeEnum.error);
          }
    
          this.libraryPacksList = libraryPacks
            .map((pm) => {
              const packs = pm.packs.filter((p) => p.format === 'fs' && p.title);
              if (packs.length !== 1) {
                this.rapportLog(pm.uuid, "Erreur sur le pack Librairie");
                return <PackModel>{};
              }
              return packs[0];
            })
            .filter(pm => pm.title)
            .sort((a, b) => a.title.localeCompare(b.title));
    
          this.libraryPacksList.forEach(p => {p.selected = false; p.disabled = false;});
    
          this.luniiPacksList = luniiPacks;

          this.luniiPacksList.forEach(lp => {
              const pack = this.libraryPacksList.find(p => p.uuid === lp.uuid);
              if(pack){
                pack.disabled = true;
              } else {
                this.unknownPack.push(lp);
              }
          });         

          if(this.lunii?.plugged && this.libraryPacksList.every(p => p.disabled)){
            this.rapportLog("La Lunii semble à jour", "Bonne nouvelle", MessageTypeEnum.success);
          }
          if(this.unknownPack.length > 0){
            this.rapportLog("La Lunii semble posséder de nouveau pack", "Interessant", MessageTypeEnum.warning);
            this.unknownPack.forEach(p => this.rapportLog(p.uuid, p.title + ` : (${p.folderName})`));
          }

          this.filterPacks();
          this.loading = false;
          this.toastr.clear(this.currentToaster?.toastId);
        },
        (errors) => {
          this.toastr.clear(this.currentToaster?.toastId);
          this.rapportLog("Au moins un appel API a échoué !", "", MessageTypeEnum.error);
          this.loading = false;
        }
      );
  }

  showSelectedChange(_check: boolean){
    this.filterValues.showSelected = _check;
    this.filterPacks();
  }
  showDisabledChange(_check: boolean){
    this.filterValues.showDisabled = _check;
    this.filterPacks();
  }

  saveSelection(_uuid: string, _check: boolean) {
    const pack = this.libraryPacksList.find(p => p.uuid === _uuid);
    if(pack){
      pack.selected = _check;
    }
  }

  countSelectedPacks(): number {
    return this.libraryPacksList.filter(p => p.selected).length;
  }
  countDisabledPacks(): number {
    return this.libraryPacksList.filter(p => p.disabled).length;
  }

  exportPacksList(){
    console.log('LibraryPacksList')
    console.log(this.libraryPacksList.map(p => ({title: p.title, uuid: p.uuid, folder: p.folderName})));
    console.log('LuniiPacksList');
    console.log(this.luniiPacksList.map(p => ({title: p.title, uuid: p.uuid, folder: p.folderName})));
    console.log('UnknownLuniiPacksList');
    console.log(this.unknownPack.map(p => ({title: p.title, uuid: p.uuid, folder: p.folderName, official: p.official})));
  }

  async pushPacks() {
    if(!this.lunii?.plugged){
      this.rapportLog("Lunii non connectée", "", MessageTypeEnum.error);
      return;
    }
    this.loading = true;
    const packsToPush = this.libraryPacksList.filter(p => p.selected && p.format.includes('fs') && !p.disabled);
    for(let i = 0; i < packsToPush.length; i++){
      let p = packsToPush[i];
      this.rapportLog(p.title, `Ajout en cours (${i + 1}/${packsToPush.length})`, MessageTypeEnum.push);
      await this.api.pushStory(p.uuid, p.path).toPromise().then(async (s) => {
        await waitTransfert(s.transferId).then(() => {
          this.rapportLog(p.title, "Pack Ajouté", MessageTypeEnum.success);
        });
      })
      .catch((error) => {
        this.rapportLog(error.message, "ERREUR", MessageTypeEnum.error);
      });
      this.toastr.clear(this.currentToaster?.toastId);
    }

    this.reload();
  }

  async removePacks() {
    if(!this.lunii?.plugged){
      this.rapportLog("Lunii non connectée", "", MessageTypeEnum.error);
      return;
    }

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '200px'
    });

    dialogRef.afterClosed().subscribe(async result => {
      if (result) {
        this.loading = true;
        for(let i = 0; i < this.luniiPacksList.length; i++){
          let p = this.luniiPacksList[i];
          this.rapportLog(p.title, `Retrait en cours (${i + 1}/${this.luniiPacksList.length})`, MessageTypeEnum.push);
          await this.api.removeStory(p.uuid).toPromise().then(async (s) => {
              this.rapportLog(p.title, "Pack Retiré", MessageTypeEnum.success);
          })
          .catch((error) => {
            this.rapportLog(error.message, "ERREUR", MessageTypeEnum.error);
          });
          this.toastr.clear(this.currentToaster?.toastId);
        }

        this.rapportLog("Purge terminée", "", MessageTypeEnum.success);    
        this.reload();
      } else {
        this.rapportLog("Purge annulé", "", MessageTypeEnum.info);
      }
    });
  }

  rapportLog(message: string, title?: string, type?: MessageTypeEnum){
    let color = 'black';
    switch(type) {
      case MessageTypeEnum.reload : this.currentToaster = this.toastr.info(message, title, {disableTimeOut: true, tapToDismiss: false}); color = 'blue'; break;
      case MessageTypeEnum.push : this.currentToaster = this.toastr.info(message, title, {disableTimeOut: true, tapToDismiss: false}); color = 'blue'; break;
      case MessageTypeEnum.info : this.toastr.info(message, title); color = 'blue'; break;
      case MessageTypeEnum.success : this.toastr.success(message, title); color = 'green'; break;
      case MessageTypeEnum.error : this.toastr.error(message, title); color = 'red'; break;
      case MessageTypeEnum.warning:  this.toastr.warning(message, title); color = 'darkorange'; break;

      default : break;
    }
    this.rapportList.push({message: `${this.datePipe.transform(new Date(), 'HH:mm:ss') + ' : '}${title ? title + ' : ' : ''}${message}`, color: color});
  }
}

export enum MessageTypeEnum {
  reload,
  warning,
  push,
  info,
  success,
  error
}

function waitTransfert(transferId: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
      const address = 'storyteller.transfer.' + transferId + '.done';

      const handler = (error: any, message: any) => {
          if (error) {
              reject(new Error('Erreur lors de la réception du message : ' + JSON.stringify(error)));
          } else {
              resolve();
          }
      };

      eb.registerHandler(address, handler);
  });
}