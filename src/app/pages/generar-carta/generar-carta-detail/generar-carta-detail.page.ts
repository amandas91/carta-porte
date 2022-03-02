import { HttpResponse } from "@angular/common/http";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, Validators } from '@angular/forms';
import { fuseAnimations } from "@fuse/animations";
import { ICatOwners } from "app/models/catalogos/cat-owners.model";
import { ICatPaises } from "app/models/catalogos/cat-paises.model";
import { CatOwnersService } from "app/services/catalogos/cat-owners.service";
import { CatPaisesService } from "app/services/catalogos/cat-paises.service";
import { AccountService } from "app/shared/auth/account.service";
import { Authority } from "app/shared/constant/authority.constants";
import { map } from "rxjs/operators";


const MaxItems = 2000;
@Component({
  selector: 'app-generar-carta-detail',
  templateUrl: './generar-carta-detail.page.html',
  animations: fuseAnimations,
  styleUrls: ['./generar-carta-detail.page.scss'],
  
})
export class GenerarCartaDetailPage implements OnInit {
  isLinear = false;
  index = 0;
  editForm = this.fb.group({
    rfc: [null, [Validators.required]],
    owner: [null, []],
    Nombre: [null, [Validators.required]],
    Rfc: [null, [Validators.required]],
    RegimenFiscal: [null, [Validators.required]],
    Pais: [null, [Validators.required]],
    Estado:[null, [Validators.required]],
    Municipio: [null, [Validators.required]],
    CodigoPostal:[null, [Validators.required]],
    RfcReceptor: [null, [Validators.required]],
    NombreReceptor: [null, []],
    UsoCFDI: [null, []],
    RFCFigura: [null, []],
    NumLicencia: [null, []],
    NombreFigura: [null, []],
    TipoFigura: [null, []],
    PermSCT:[null, [Validators.required]],
    ConfigVehicular:[null, [Validators.required]],
    NumPermisoSCT:[null, [Validators.required]],
    AnioModeloVM:[null, [Validators.required]],
    PlacaVM:[null, [Validators.required]],
    PolizaRespCivil:[null, [Validators.required]],
    AseguraRespCivil:[null, [Validators.required]],
    BienesTransp:[null, [Validators.required]],
    Descripcion:[null, [Validators.required]],
    Cantidad:[null, [Validators.required]],
    Unidad:[null, [Validators.required]],
    PesoEnKg:[null, [Validators.required]],
    IDUbicacion:[null, [Validators.required]],
    RFCRemitenteDestinatario:[null, [Validators.required]],
    TipoHorario:[null, [Validators.required]],
    Correo:[null, [Validators.required]],
    DistanciaRecorrida:[null, [Validators.required]],
  });

  catOwners: ICatOwners[];
  catPaises: ICatPaises[];

  constructor(private fb: FormBuilder, private catOwnersService: CatOwnersService,
    private catPaisesService: CatPaisesService,
    protected accountService: AccountService) { }

  ngOnInit(): void {
    this.catOwnersService
            .query({ size: MaxItems },  (this.hasRol([Authority.DMC]) === true ? 2 : 1))
            .pipe(
                map((res: HttpResponse<ICatOwners[]>) => {
                    return res.body ? res.body : [];
                })
            )
            .subscribe((resBody: ICatOwners[]) => (this.catOwners = resBody));

    this.catPaisesService
    .query({ size: MaxItems },  (this.hasRol([Authority.DMC]) === true ? 2 : 1))
    .pipe(
        map((res: HttpResponse<ICatPaises[]>) => {
            return res.body ? res.body : [];
        })
    )
    .subscribe((resBody: ICatPaises[]) => (this.catPaises = resBody));

  }

  hasRol(authorities: string[] | string): boolean {
    return this.accountService.hasAnyAuthority(authorities);
  }

}
