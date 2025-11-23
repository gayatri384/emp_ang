export interface Asset {
  id?: number;
  assetName: string;
  description?: string;
  serialNumber: string;
  category: string;
  purchaseDate: Date;
  isAvailable: boolean;
  isDamaged: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
