
export type ProductCategory = "Category A" | "Category B" | "Category C";

export type Product = {
  id: string,
  salePrice: number,
  price: number,
  productName: string,
  productCategory: ProductCategory;
}
