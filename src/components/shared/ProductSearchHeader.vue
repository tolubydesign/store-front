<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import IconSearch from '@/components/icons/IconSearch.vue'
import IconDropDown from '@/components/icons/IconDropDown.vue'
import { storeToRefs } from 'pinia';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Store
const productStore = useProductStore();
const { products, orderedProducts } = storeToRefs(productStore);

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

// Class names
const sectionClassName = "product--header--component py-3 border-y-[3px] border-gray-200 px-2";
const headerProductSearchGroupClassName = "flex flex-row justify-center items-center header--listing--group";
const searchInputGroupClassName = "flex flex-row justify-center items-center header--search--group"
const searchInputClassName = "border-[3px] border-gray-200 rounded-l-lg p-1";
const searchButtonClassName = "bg-gray-200 p-2 rounded-r-lg";
const sortByGroupClassName = "flex flex-row justify-center items-center";
const sortTitle = "text-gray-700 font-medium md:text-base mr-2";
const sortSelector = "sort--selector rounded-md px-7 py-2 font-medium text-black bg-gray-200";
const sortSelectorOption = "sort--selector-option font-medium";

function updateSearchInputValue(event: Event | any) {
  searchInputValue.value = event?.target?.value
}

function searchForItem() {
  // Router search ?q=...
  // redirect to dynamic page 
  console.log("search input value", searchInputValue.value);
}

</script>

<template>
  <div data-element="Products Header Component" :class="sectionClassName">
    <div :class="headerProductSearchGroupClassName">
      <div v-if="products && products.length" class="md:mr-[50px] flex flex-row">
        <p class="font-medium mr-3">Products found:</p>
        <p class="font-bold">{{ products.length }}</p>
      </div>

      <div :class="searchInputGroupClassName">
        <input :class="searchInputClassName" placeholder="Search for items in this list"
          :value="searchInputValue"
          @input="(event: Event) => updateSearchInputValue(event)"
          @keyup.enter="searchForItem"/>
        <button :class="searchButtonClassName" @click="searchForItem">
          <IconSearch :height="20" :width="20" />
        </button>
      </div>
    </div>

    <div :class="sortByGroupClassName">
      <p :class="sortTitle">Sort By:</p>

      <select :class="sortSelector" name="sorting" id="sorting-selector" v-model="sortingSelection">
        <template v-for="option in sortingOptions">
          <option :class="sortSelectorOption" :value="option.value">{{ option.text }}</option>
        </template>
      </select>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/styles/modules/product-header.module.scss";

</style>
