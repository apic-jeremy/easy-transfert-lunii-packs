export interface PacksModel {
    uuid: string;
    packs: PackModel[];
}

export interface PackModel {
    description: string;
    format: string;
    image: string;
    nightModeAvailable: boolean;
    official: boolean;
    path: string;
    timestamp: number;
    title: string;
    uuid: string;
    version: number;
    folderName: string;
    selected: boolean;
    disabled: boolean;
}