import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { PackModel, PacksModel } from "../model/pack.model";
import { LuniiModel } from "../model/lunii.model";

@Injectable({
    providedIn: "root",
  })

  export class ApiService {
    private authenticationHeaders: HttpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });

    constructor(private http: HttpClient){

    }

    public getLibraryPacks() {
        return this.http.get<PacksModel[]>("http://localhost:8080/api/library/packs", {
            headers: this.authenticationHeaders,
        });
    }
    public getLuniiPacks() {
        return this.http.get<PackModel[]>("http://localhost:8080/api/device/packs", {
            headers: this.authenticationHeaders,
        });
    }

    public pushStorie(_uuid: string, _path: string) {
        return this.http.post<any>("http://localhost:8080/api/device/addFromLibrary", 
            JSON.stringify({uuid: _uuid, path: _path})
        );
    }

    public getLuniiInfo() {
        return this.http.get<LuniiModel>("http://localhost:8080/api/device/infos", {
            headers: this.authenticationHeaders,
        });
    }
}