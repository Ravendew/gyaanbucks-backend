export class CreateCategoryDto {
  name!: string;
  icon?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
}

export class UpdateCategoryDto {
  name?: string;
  icon?: string;
  description?: string;
  position?: number;
  isActive?: boolean;
}

export class ReorderCategoryDto {
  items!: {
    id: string;
    position: number;
  }[];
}
