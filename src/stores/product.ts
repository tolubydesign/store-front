import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import type { Product, ProductCategory } from '@/models/product.model';

export const useProductStore = defineStore('product', () => {
  const fetchProductsLoader = ref(true);
  const fetchProductImagesLoader = ref(false);
  const products = ref<Product[] | undefined>(undefined);
  const orderedProducts = ref<Product[] | undefined>(undefined);
  const productCategories = ref<Record<ProductCategory, number> | undefined>(undefined);

  /**
   * @description Fetch Product data
   * @returns 
   */
  async function GetProducts(): Promise<AxiosResponse<any, any> | Error | void> {
    const file = '../src/assets/data/product.json';

    fetchProductsLoader.value = true;
    return axios.get(file).then((response: any) => {
      // TODO: check for possible errors. Create reusable function.
      products.value = response.data?.products;
      console.log("products fetched", response.data);
      
      // Deep copy to disconnect values.
      orderedProducts.value = JSON.parse(JSON.stringify(products.value));

      SortKnownCategories();
      return response
    }).catch((error: Error) => {
      console.log("Error fetching products", error);
      return error;
    }).finally(() => {
      fetchProductsLoader.value = false;
    })
  }

  /**
   * Fetch images to populate. This would ideally be provided  
   * @returns 
   */
  async function GetProductImages(): Promise<AxiosResponse<any, any> | Error | void> {
    fetchProductImagesLoader.value = true;
    return axios({
      // url: endpoint,
      method: 'GET',
    }).then((response) => {
      return response
    }).catch((error: Error) => {
      console.log("Error getting images", error);
      return error;
    }).finally(() => {
      fetchProductImagesLoader.value = false;
    })
  };

  function SortKnownCategories() {
    if (!products || !products.value) {
      throw new Error("No products to sort");
    }

    // const foundCategories: { category: ProductCategory, total: number }[] = [];
    let foundCategories: Record<ProductCategory, number> | {} | any = {};

    for (var i = 0; i < products.value?.length; i++) {
      const product: Product = products.value[i];
      const category: ProductCategory = product.productCategory;

      if (!foundCategories[category]) {
        foundCategories[category] = 1;
      } else {
        foundCategories[category] = foundCategories[category] + 1;
      };
    };

    productCategories.value = foundCategories;
  }

  return {
    fetchProductsLoader,
    fetchProductImagesLoader,
    products,
    orderedProducts,
    productCategories,

    GetProducts,
    GetProductImages,
    SortKnownCategories,
  };
})
