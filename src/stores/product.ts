import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import type { Product, ProductCategory } from '@/models/product.model';
import { type Router } from 'vue-router';

export const useProductStore = defineStore('product', () => {
  const fetchProductsLoader = ref(true);
  const fetchProductImagesLoader = ref(false);
  
  const products = ref<Product[] | undefined>(undefined);
  const orderedProducts = ref<Product[] | undefined>(undefined);
  
  const productCategories = ref<Record<ProductCategory, number> | undefined>(undefined);
  const selectedProductCategories = ref<string | undefined>(undefined);

  const searchInputValue = ref("");
  const sortingOptions = ref<{ value: string, text: string }[]>([
    {
      value: "",
      text: ""
    },
    {
      value: "name",
      text: "Name A-Z"
    },
    {
      value: "category",
      text: "Category A-Z"
    },
    {
      value: "priceAsc",
      text: "Price: Low-High"
    },
    {
      value: "priceDesc",
      text: "Price: High-Low"
    }
  ]);
  const sortingSelection = ref(sortingOptions.value[0].value)

  const filters = ref();
  const selectedFilter = ref();

  /**
   * @description Fetch Product data
   * @returns 
   */
  async function GetProducts(): Promise<AxiosResponse<any, any> | Error | void> {
    fetchProductsLoader.value = true;
    const file = new URL(`../assets/data/product.json`, import.meta.url).href
    return axios.get(file).then((response: any) => {
      // TODO: check for possible errors. Create reusable function.
      products.value = response.data?.products;

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

  function FilterProductsBy({ category, search, filter }: { category?: string, search?: string, filter?: string }) {
    if (!products?.value) {
      console.error("No products found");
      return
    }
    
    // console.log("FilterProductsBy:products.value:", products.value)
    orderedProducts.value = JSON.parse(JSON.stringify(products.value));

    if (category) {
      orderedProducts.value = orderedProducts.value?.filter((product) => product.productCategory.toLowerCase() === category.toLowerCase());
    }
  }

  function GetAllRelevantParameters(router: Router) {
    const category = router.currentRoute.value.params?.category as string | undefined;
    const filter = router.currentRoute.value.params?.filter as string | undefined;
    const search = router.currentRoute.value.query?.q as string | undefined;

    console.log("GetAllRelevantParameters, category", category);
    console.log("GetAllRelevantParameters, filter", filter);
    console.log("GetAllRelevantParameters, search", search);

    selectedProductCategories.value = category;
    selectedFilter.value = filter;
    searchInputValue.value = search!;

    FilterProductsBy({
      category: category,
      filter: filter,
      search: search
    });
  }

  return {
    fetchProductsLoader,
    fetchProductImagesLoader,
    products,
    orderedProducts,
    productCategories,
    selectedProductCategories,
    searchInputValue,
    sortingOptions,
    sortingSelection,
    selectedFilter,
    filters,

    GetProducts,
    GetProductImages,
    SortKnownCategories,
    FilterProductsBy,
    GetAllRelevantParameters,
  };
})
