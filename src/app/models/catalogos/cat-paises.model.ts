export interface ICatPaises {
    IdEstado?: number;
    ClaveEstado?: string;
    Nombre?: string;
    CreateDate?: string;
    _links?: any;
    owner?: number;
    name?: string;
  
  }
  
  export class CatPaises implements ICatPaises {
    constructor(
        public IdEstado?: number,
        public ClaveEstado?: string,
        public Nombre?: string,
        public CreateDate?: string,
        public _links?: any,
        public owner?: number,
        public name?: string
    ) { }
  }
  