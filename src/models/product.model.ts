
export type ProductCategory = "Category A" | "Category B" | "Category C" | "All";

export type Product = {
  id: string,
  salePrice?: number,
  price: number,
  productName: string,
  productCategory: ProductCategory;
}

export type ProductFilterOptions = "name" | "category" | "priceAsc" | "priceDesc";
