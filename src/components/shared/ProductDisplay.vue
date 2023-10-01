<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import IconSearch from '@/components/icons/IconSearch.vue'
import IconDropDown from '@/components/icons/IconDropDown.vue'
import { storeToRefs } from 'pinia';
import { onMounted, ref, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import Product from '@/components/shared/Product.vue';

// Class names
const sectionClassName = "flex flex-col justify-center items-center";

// Store
const productStore = useProductStore();
const { products, orderedProducts } = storeToRefs(productStore);

const showMore = ref<boolean>(false);

onMounted(() => {
  showMore.value = false;
});

watchEffect(() => {
  if (orderedProducts) {

  }
  showMore.value = false;
})
</script>

<template>
  <div data-element="Products Header Component" :class="sectionClassName">
    <div class="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-2 w-full">
      <template v-for="product in orderedProducts" :key="product.id">
        <Product :product="product" />
      </template>
    </div>

    <div v-if="!showMore">
      <button @click="() => showMore = true"> Show More </button>
    </div>
  </div>
</template>

<style scoped>
@import "../../assets/styles/modules/product-header.module.scss";
</style>
