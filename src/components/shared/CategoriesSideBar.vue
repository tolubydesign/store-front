<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import IconSearch from '@/components/icons/IconSearch.vue'
import IconDropDown from '@/components/icons/IconDropDown.vue'
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { type ProductCategory } from "@/models/product.model";

const router = useRouter();

// Store
const productStore = useProductStore();
const { products, productCategories } = storeToRefs(productStore);

console.log("Object.keys(productCategories.value)[0]", productCategories.value)
const checkedCategories = ref([])
const selectedCategory = ref<Record<ProductCategory, number> | undefined>(undefined)

const categoryGroupClassName = "flex flex-col justify-center items-center";
const categorySelector = "selector--dropdown-basic rounded-md pl-4 pr-8 py-2 font-medium text-black bg-gray-200";
const sortTitle = "text-gray-700 font-medium md:text-base mr-2";
const sortSelectorOption = "sort--selector-option font-medium";

</script>

<template>
  <div v-if="products" data-element="Categories Selection Component" :class="''">
    <div :class="categoryGroupClassName">
      <select v-if="productCategories" :class="categorySelector" name="sorting" id="sorting-selector"
        v-model="selectedCategory">
        <template v-for="(total, category) in productCategories">
          {{ category }}
          <option :class="sortSelectorOption" :value="category">{{ category }}</option>
        </template>
      </select>
    </div>

    <div class="flex flex-col">
      <template v-if="productCategories" v-for="(total, category) in productCategories">
        <div class="flex flex-row mt-3">
          <input class="mr-2" type="checkbox" :id="category" :value="category" v-model="checkedCategories">
          <label :for="category" class="flex">
            <p class=" mr-4">{{ category }}</p>
            <p class="">{{ total }}</p>
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/modules/product-header.module.scss";
@import "../../assets/styles/selector.scss";

</style>
