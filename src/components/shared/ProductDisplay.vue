<script setup lang="ts">
import { useProductStore } from '@/stores/product';
import { storeToRefs } from 'pinia';
import { onMounted, ref, watch, watchEffect } from 'vue';
import Product from '@/components/shared/Product.vue';

// Class names
const sectionClassName = "flex flex-col justify-center items-center mb-10";

// Store
const productStore = useProductStore();
const { products, orderedProducts } = storeToRefs(productStore);

const showMore = ref<boolean>(false);

onMounted(() => {
  showMore.value = false;
});

// watch products
watch(orderedProducts, async (next, previous) => {
  showMore.value = false;
})

</script>

<template>
  <div data-element="Products Display Component" :class="sectionClassName">
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 w-full">
      <!-- only show first 8 items -->
      <template v-if="!showMore">
        <template v-for="(product, index) in orderedProducts" :key="product.id">
          <Product v-if="index <= 7" :product="product" />
        </template>
      </template>
      <!-- show full list of items -->
      <template v-else>
        <template v-for="product in orderedProducts" :key="product.id">
          <Product :product="product" />
        </template>
      </template>
    </div>

    <div v-if="!showMore" class="mt-4">
      <button @click="() => showMore = true" class="font-bold text-slate-800 underline"> Show More </button>
    </div>
  </div>
</template>

<style scoped></style>
