<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import IconSearch from '@/components/icons/IconSearch.vue'
import { storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// Store
const productStore = useProductStore();
const { products } = storeToRefs(productStore);

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
const filterDropdown = ref(false);
const sortByDropdown = ref(false);

// Class names
const sectionClassName = "product--header--component py-3 border-y-[3px] border-gray-200 px-2 w-full";
const headerProductSearchGroupClassName = "flex flex-row justify-center items-center header--listing--group w-full md:w-auto";
const searchInputGroupClassName = "flex flex-row w-full md:w-auto justify-center items-center header--search--group"
const searchInputClassName = "border-[3px] border-gray-200 rounded-l-lg p-1 w-full md:w-auto";
const searchButtonClassName = "bg-gray-200 p-2 rounded-r-lg";
const sortByGroupClassName = "hidden md:flex flex-row justify-center items-center";
const sortTitle = "text-gray-700 font-medium md:text-base mr-2";
const sortSelectorClassName = "selector--dropdown-basic rounded-md px-7 py-2 font-medium text-black bg-gray-200";
const mobileSortSelectorClassName = "px-4 py-2 font-medium text-black bg-gray-200 rounded-md w-[45%] mx-[2.5%]"
const sortSelectorOption = "sort--selector-option font-medium";

function updateSearchInputValue(event: Event | any) {
  searchInputValue.value = event?.target?.value
}

function searchForItem() {
  // Router search ?q=...
  // redirect to dynamic page 
  console.log("search input value", searchInputValue.value);
}

const showFilters = () => filterDropdown.value != filterDropdown.value;
const showSortBy = () => sortByDropdown.value != sortByDropdown.value;

</script>

<template>
  <div data-element="Products Header Component" :class="sectionClassName">
    <div class="flex flex-row justify-between items-center max-w-[1400px] mx-auto ">
      <div :class="headerProductSearchGroupClassName">
        <div v-if="products && products.length" class="hidden md:flex flex-row md:mr-[50px]">
          <p class="font-medium mr-3">Products found:</p>
          <p class="font-bold">{{ products.length }}</p>
        </div>

        <div :class="searchInputGroupClassName">
          <input :class="searchInputClassName" placeholder="Search for items in this list" :value="searchInputValue"
            @input="(event: Event) => updateSearchInputValue(event)" @keyup.enter="searchForItem" />
          <button :class="searchButtonClassName" @click="searchForItem">
            <IconSearch :height="20" :width="20" />
          </button>
        </div>
      </div>

      <div :class="sortByGroupClassName">
        <p :class="sortTitle">Sort By:</p>

        <select :class="sortSelectorClassName" name="sorting" id="sorting-selector" v-model="sortingSelection">
          <template v-for="option in sortingOptions">
            <option :class="sortSelectorOption" :value="option.value">{{ option.text }}</option>
          </template>
        </select>
      </div>
    </div>

    <!-- mobile sort and filter -->
    <div class="flex md:hidden flex-row justify-around items-center mt-4">
      <button :class="mobileSortSelectorClassName" @click="showFilters()">
        Filters
      </button>

      <button :class="mobileSortSelectorClassName" @click="showSortBy()">
        Sort By
      </button>
    </div>

    <!-- TODO: create dropdown for filters (categories) and sort by (asc and desc) -->
    <div></div>
  </div>

  <!-- mobile -->
  <div class="flex md:hidden flex-start mt-10">
    <div v-if="products && products.length" class="flex flex-row">
      <p class="font-medium mr-3">Products found:</p>
      <p class="font-bold">{{ products.length }}</p>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/styles/selector.scss";
</style>
