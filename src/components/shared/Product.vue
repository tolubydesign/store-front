<script setup lang="ts">
import IconArrowDirectionRight from "@/components/icons/IconArrowDirectionRight.vue"
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '@/models/product.model';

defineProps<{
  product: Product
}>()

const showViewButton = ref<boolean>(false)

// Styling properties
const buttonOpacityTransitionProperties = "transition-all duration-150";

// Class name 
const sectionClassName = "product--section block px-5 py-5 rounded-md border-[3px] border-transparent hover:cursor-pointer hover:border-gray-300 transition duration-150";
const saleBadgeClassName = "absolute top-0 left-0 bg-gray-500 rounded-tl-md rounded-br-md px-2 py-1";
const productInformationClassName = "md:mt-4";
const productImageGroupClassName = "rounded-md min-h-[260px] bg-gray-300";
const viewProductButtonClassName = `flex flex-row justify-center items-center bg-gray-600 text-white font-medium px-2 sm:px-3 md:px-2 xl:px-6 rounded-md`;
const basicPriceText = "font-normal text-md md:text-base text-gray-800";
const dimmedPriceText = "font-normal text-sm md:text-md text-gray-400";

const updateProductViewState = (show: boolean) => {
  showViewButton.value = show;
}

const formatCurrency = (currency: number): string => {
  return currency.toLocaleString("en-US") + '.00'
}

</script>

<template>
  <div data-element="Product Component" :class="sectionClassName" @mouseenter="updateProductViewState(true)"
    @mouseleave="updateProductViewState(false)">
    <div class="flex flex-col relative">

      <div v-if="product.salePrice" :class="saleBadgeClassName">
        <p class="font-medium uppercase text-white text-md md:text-lg">Sale</p>
      </div>

      <div :class="productImageGroupClassName">
        <!-- <img class="" src="_blank" srcset="" /> -->
      </div>

      <div :class="productInformationClassName">
        <div>
          <p class="text-[16px] md:text-[18px] font-normal text-gray-600">{{ product.productName }}</p>
          <p class="text-md font-normal text-gray-400 mt-1">{{ product.productCategory }}</p>
        </div>

        <div class="flex flex-row justify-between w-full mt-2">
          <div class="mt-auto">
            <p v-if="product.salePrice" :class="basicPriceText">${{ formatCurrency(product.salePrice) }}</p>
            <p :class="product.salePrice ? dimmedPriceText + ' line-through' : basicPriceText">
              ${{ formatCurrency(product.price) }}
            </p>
          </div>

          <button on
            :class="[{ 'md:opacity-0': !showViewButton }, viewProductButtonClassName, buttonOpacityTransitionProperties]">
            <p class="text-white text-xm md:text-sm md:text-lg font-medium md:mr-3 uppercase">View</p>
            <IconArrowDirectionRight class="hidden md:block w-full max-w-[25px] max-w-[25px] lg:max-w-[40px] lg:max-h-[40px]" :width="40"
              :height="40" :color="'#fff'" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
</style>
