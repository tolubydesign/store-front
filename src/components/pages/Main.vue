<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useProductStore } from "@/stores/product";
import ProductSearchHeader from '@/components/shared/ProductSearchHeader.vue';
import CategoriesSideBar from "@/components/shared/CategoriesSideBar.vue"
import ProductDisplay from "@/components/shared/ProductDisplay.vue"
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';
const router = useRouter();

// Store
const productStore = useProductStore();
const { } = storeToRefs(productStore);
const { GetProducts } = productStore;

async function fetchProducts(): Promise<void> {
  GetProducts();
}

onMounted(() => {
  fetchProducts()
})

</script>

<template>
  <div>
    <ProductSearchHeader />
    <div class="grid md:grid-cols-[160px_minmax(0,_1fr)] mt-10 max-w-[1400px] mx-auto">
      <CategoriesSideBar class="hidden md:block"  />
      <ProductDisplay />
    </div>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  position: relative;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {

  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
