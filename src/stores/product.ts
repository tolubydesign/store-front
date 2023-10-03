import { ref } from 'vue'
import { defineStore } from 'pinia'
import axios, { type AxiosResponse } from 'axios'
import type { Product, ProductCategory, ProductFilterOptions } from '@/models/product.model';
import { type Router } from 'vue-router';

export const useProductStore = defineStore('product', () => {
  const fetchProductsLoader = ref(true);
  const fetchProductImagesLoader = ref(false);

  const products = ref<Product[] | undefined>(undefined);
  const orderedProducts = ref<Product[] | undefined>(undefined);

  const productCategories = ref<Record<ProductCategory, number> | undefined>(undefined);
  const selectedProductCategory = ref<string | undefined>(undefined);

  const searchInputValue = ref("");
  const sortingOptions = ref<{ value: ProductFilterOptions, text: string }[]>([
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
  const sortingSelection = ref<ProductFilterOptions | string | undefined>(sortingOptions.value[0].value)

  /**
   * Fetch Product data
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

      FindAllPossibleCategories();
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
      console.warn("Error getting images", error);
      return error;
    }).finally(() => {
      fetchProductImagesLoader.value = false;
    })
  };

  /**
   * Find all possible product categories from the list of products received from the database.
   */
  function FindAllPossibleCategories() {
    if (!products || !products.value) {
      throw new Error("No products to sort");
    }

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

    // TODO: Add category of all. 
    productCategories.value = foundCategories;
  }

  /**
   * Get all the relevant url parameters and query values. Capture them in the store for global use.
   * @param router Vue Router
   */
  function GetAllRelevantParameters(router: Router) {
    const category = router.currentRoute.value.params?.category as string | undefined;
    const filter = router.currentRoute.value.params?.filter as string | undefined;
    const search = router.currentRoute.value.query?.q as string | undefined;

    // TODO: simplify categories
    selectedProductCategory.value = category;
    sortingSelection.value = filter;
    searchInputValue.value = search!;

    FilterProductsBy({
      category: category,
      filter: filter,
      search: search
    });
  };

  /**
   * Filter products based on the values provided. These should ideally should reference what is in the browser's url.
   * @param param.categories Category of product
   * @param param.search Search input user has provided. What the user is searching for.
   * @param param.search The order at which products are presented. Ascending, Descending, ordered by Name etc.
   * @returns 
   */
  function FilterProductsBy({ category, search, filter }: { category?: string, search?: string, filter?: string }) {
    if (!products?.value) {
      console.error("No products found");
      return
    }

    // Deep copy to separate values from one another
    orderedProducts.value = JSON.parse(JSON.stringify(products.value));

    if (category && (productCategories.value && productCategories?.value[category as ProductCategory])) {
      orderedProducts.value = orderedProducts.value?.filter((product) => product.productCategory.toLowerCase() === category.toLowerCase());
    } else if (category?.toLowerCase() === "all") {
      orderedProducts.value = JSON.parse(JSON.stringify(products.value));
    }

    // make sure the products match the search;
    if (search && orderedProducts.value) {
      orderedProducts.value = JSON.parse(JSON.stringify(orderedProducts.value)).filter((product: Product) => {
        if (product.price.toString().includes(search.toLowerCase())) return product;
        if (product.productCategory.toLowerCase().includes(search.toLowerCase())) return product;
        if (product.productName.toLowerCase().includes(search.toLowerCase())) return product;
      });
    }

    // Check if there are any assigned order by values
    SortBy()
  }

  /**
   * The order at which products are presented. Price Ascending, Price Descending, ordered by Name etc.
   * @returns 
   */
  function SortBy() {
    if (!orderedProducts?.value || orderedProducts.value.length === 1) return;


    switch (sortingSelection.value) {
      case "priceAsc":
        orderedProducts.value = orderedProducts.value.sort((a, b) => {
          // TODO: this can be simplified
          if (a?.salePrice && b?.salePrice) {
            return a.salePrice - b.salePrice
          } else if (!a?.salePrice || !b?.salePrice) {
            // Once or more sales prices are not available for comparison
            if (!a?.salePrice && b?.salePrice) {
              return a.price - b.salePrice;
            } else if (a?.salePrice && !b?.salePrice) {
              return a.salePrice - b.price;
            }
          };
          return a.price - b.price;
        });
        break;
      case "priceDesc":
        orderedProducts.value = orderedProducts.value.sort((a, b) => {
          if (b?.salePrice && a?.salePrice) {
            return b.salePrice - a.salePrice
          } else if (!b?.salePrice || !a?.salePrice) {
            // Once or more sales prices are not available for comparison
            if (!b?.salePrice && a?.salePrice) {
              return b.price - a.salePrice;
            } else if (b?.salePrice && !a?.salePrice) {
              return b.salePrice - a.price;
            }
          };
          return b.price - a.price;
        });
        break;
      case "category":
        orderedProducts.value = orderedProducts.value.sort((a, b) => {
          if (a.productCategory < b.productCategory) return -1;
          if (a.productCategory > b.productCategory) return 1;
          return 0;
        });

        break;
      case "name":
        orderedProducts.value = orderedProducts.value.sort((a, b) => {
          if (a.productName < b.productName) return -1;
          if (a.productName > b.productName) return 1;
          return 0;
        });
        break;
      default:
      // do nothing
    }
  };

  return {
    fetchProductsLoader,
    fetchProductImagesLoader,
    products,
    orderedProducts,
    productCategories,
    selectedProductCategory,
    searchInputValue,
    sortingOptions,
    sortingSelection,

    GetProducts,
    GetProductImages,
    FilterProductsBy,
    GetAllRelevantParameters,
    SortBy,
  };
})
