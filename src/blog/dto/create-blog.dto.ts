export class CreateBlogDto {
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  category: string;
  tags?: string;
  metaTitle?: string;
  metaDesc?: string;
  isPublished?: boolean;
}
