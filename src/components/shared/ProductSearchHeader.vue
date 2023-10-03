<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import IconSearch from '@/components/icons/IconSearch.vue'
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch } from 'vue';
import { useRouter, type RouteLocationNormalizedLoaded } from 'vue-router';

const router = useRouter();

// Store
const productStore = useProductStore();
const {
  products,
  searchInputValue,
  sortingOptions,
  sortingSelection,
  selectedProductCategory,
  productCategories
} = storeToRefs(productStore);
const { GetAllRelevantParameters } = productStore

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
const mobileSortByButtonClassName = "text-white text-sm font-semibold bg-cyan-700 rounded-md px-3.5 py-2.5 shadow-sm hover:bg-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-gray-200";
const mobileFilterByButtonClassName = "text-white text-sm font-semibold bg-cyan-700 rounded-md px-3.5 py-2.5 shadow-sm hover:bg-cyan-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:bg-gray-200"

function updateSearchInputValue(event: Event | any) {
  searchInputValue.value = event?.target?.value
}

function searchForItem() {
  router.push({ query: { q: searchInputValue.value } }).then(() => {
    GetAllRelevantParameters(router);
  });
}

onMounted(() => {
  closeDropdowns();
})

watch(sortingSelection, async (next, previous) => {
  if (next && next != previous) directToFilterPage(next);
})

const showFilters = () => {
  if (sortByDropdown.value) closeDropdowns();
  filterDropdown.value = !filterDropdown.value;
};

const showSortBy = () => {
  if (filterDropdown.value) closeDropdowns();
  sortByDropdown.value = !sortByDropdown.value;
};

const sortProductsBy = (filter: string) => {
  sortingSelection.value = filter;
  closeDropdowns()
}

const filterProductsBy = (category: string) => {
  selectedProductCategory.value = category

  router.push(`/category/${selectedProductCategory.value}`).then(() => {
    GetAllRelevantParameters(router);
  });

  closeDropdowns()
}

const closeDropdowns = () => {
  sortByDropdown.value = false;
  filterDropdown.value = false;
}

// TODO: handle redirect in the store
const directToFilterPage = (filter: string) => {
  let url: string = '';

  const currentRoute: RouteLocationNormalizedLoaded = router.currentRoute.value;

  (selectedProductCategory?.value) ?
    url = `/category/${selectedProductCategory.value}/filter/${filter}` :
    url = `/category/all/filter/${filter}`;

  if (currentRoute.query.q || searchInputValue.value) {
    url += `?q=${searchInputValue.value}`;
  }

  router.push(url).then(() => {
    GetAllRelevantParameters(router);
  });
}

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

      <!-- sort by: desktop -->
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
    <!-- TODO: add animation -->
    <div v-if="filterDropdown || sortByDropdown" class="mt-4 mx-[2.5%]">
      <div v-if="sortByDropdown" class="grid grid-cols-2 gap-3">
        <template v-if="sortingOptions" v-for="option in sortingOptions">
          <button :disabled="option.value.toLowerCase() === sortingSelection?.toLowerCase()"
            @click="sortProductsBy(option.value)" :class="mobileSortByButtonClassName">
            {{ option.text }}
          </button>
        </template>
      </div>

      <div v-if="filterDropdown" class="grid grid-cols-2 gap-3">
        <template v-if="productCategories" v-for="(total, category) in productCategories">

          <button :disabled="category.toLowerCase() === selectedProductCategory?.toLowerCase()"
            @click="filterProductsBy(category)" :class="mobileFilterByButtonClassName">
            {{ category }}
          </button>

        </template>
      </div>
    </div>
  </div>

  <!-- mobile -->
  <div class="flex md:hidden flex-start mt-10">
    <div v-if="products && products.length" class="flex flex-row">
      <p class="font-medium mr-3">Products found:</p>
      <p class="font-bold">{{ products.length }}</p>
    </div>
  </div>

  <!-- TODO: create a clear filters / sort by -->
</template>

<style scoped>
@import "../../assets/styles/selector.scss";
</style>
