export class CreateCategoryDto {
  name!: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}

export class UpdateCategoryDto {
  name?: string;
  icon?: string;
  description?: string;
  isActive?: boolean;
}
