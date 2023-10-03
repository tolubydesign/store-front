<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Store
const productStore = useProductStore();
const { products, productCategories, selectedProductCategory } = storeToRefs(productStore);
const { GetAllRelevantParameters } = productStore;

const showSearchButton = ref(false);

const categoryGroupClassName = "flex flex-col justify-center items-center";
const categorySelector = "rounded-md pl-4 pr-8 py-2 font-medium text-black bg-gray-200 w-full";
const applyButtonClassName = "text-white text-sm font-semibold bg-gray-600 rounded-md px-3.5 py-2.5 mt-4 shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"

onMounted(() => {
  showSearchButton.value = false;
  selectedProductCategory.value = undefined;
})

// Watch the selected categories
watch(selectedProductCategory, async (next, previous) => {
  // get current rout path
  const category = router.currentRoute.value.params.category as string

  // Show button once the selected categories has changed
  (next !== previous && category?.toLowerCase() !== next?.toLowerCase()) ?
    showSearchButton.value = true :
    showSearchButton.value = false;
})

const searchForProductsWithCategories = () => {
  router.push(`/category/${selectedProductCategory.value}`).then(() => {
    GetAllRelevantParameters(router);
  });
  showSearchButton.value = false;
}

</script>

<template>
  <div v-if="products" data-element="Categories Selection Component" :class="''">
    <div :class="categoryGroupClassName">
      <button v-if="productCategories" :class="categorySelector">
        Categories
      </button>
    </div>

    <div class="flex flex-col md:mx-2">
      <template v-if="productCategories" v-for="(total, category) in productCategories">
        <div class="flex flex-row mt-3" :data-value="category">
          <input class="mr-2 hover:cursor-pointer" type="radio" :id="category" :value="category"
            v-model="selectedProductCategory">
          <label :for="category" class="flex hover:cursor-pointer">
            <p class=" mr-4">{{ category }}</p>
            <p class="">{{ total }}</p>
          </label>
        </div>
      </template>

      <button v-show="showSearchButton && selectedProductCategory" @click="searchForProductsWithCategories"
        :class="applyButtonClassName">
        Apply
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/selector.scss";
</style>
