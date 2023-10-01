<script setup lang="ts">
import IconArrowDirectionRight from "@/components/icons/IconArrowDirectionRight.vue"
import { computed, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { Product } from '@/models/product.model';

const props = defineProps<{
  product: Product
}>()

console.log("props.product.salePrice", props.product.salePrice)
const onSale = ref<boolean>(!!props.product.salePrice);
const showViewButton = ref<boolean>(false)

const router = useRouter();

// Styling properties
const buttonOpacityTransitionProperties = "transition-all duration-150";

// Class name 
const sectionClassName = "product--section block px-5 py-5 rounded-md border-[3px] border-transparent hover:cursor-pointer hover:border-gray-300 transition duration-150";
const saleBadgeClassName = "absolute top-0 left-0 bg-gray-500 rounded-tl-md rounded-br-md px-2 py-1";
const productInformationClassName = "md:mt-4";
const productImageGroupClassName = "rounded-md min-h-[260px] bg-gray-300";
const viewProductButtonClassName = `flex flex-row justify-center items-center bg-gray-800 text-white font-medium px-6 rounded-md`;
const basicPriceText = "font-normal text-md md:text-base text-gray-800";
const dimmedPriceText = "font-normal text-sm md:text-md text-gray-400";
const salePriceTextClassName = `${basicPriceText}`;

const priceTextClassName = onSale ? `${basicPriceText} ` : dimmedPriceText + " line-through";

const viewProductButton = reactive([
  viewProductButtonClassName,
  !showViewButton ?? "opacity-0",
  buttonOpacityTransitionProperties
])

function updateProductViewState(show: boolean) {
  showViewButton.value = show;
  // console.log("updateProductViewState", showViewButton.value);
}

</script>

<template>
  <div data-element="Products Header Component" :class="sectionClassName" @mouseenter="updateProductViewState(true)"
    @mouseleave="updateProductViewState(false)">
    <div class="flex flex-col relative">

      <div v-if="product.salePrice" :class="saleBadgeClassName">
        <p class="font-medium uppercase text-white text-md md:text-lg">Sale</p>
      </div>

      <div :class="productImageGroupClassName">
        <img class="" src="" srcset="" />
      </div>

      <div :class="productInformationClassName">
        <div>
          <p class="text-[16px] md:text-[18px] font-normal text-gray-600">{{ product.productName }}</p>
          <p class="text-md font-normal text-gray-400 mt-1">{{ product.productCategory }}</p>
        </div>

        <div class="flex flex-row justify-between w-full mt-2">
          <div class="mt-auto">
            <p v-if="product.salePrice" :class="salePriceTextClassName">${{ product.salePrice }}</p>
            <p :class="priceTextClassName">
              ${{ product.price }}
            </p>
          </div>

          <button :class="viewProductButton">
            View
            <IconArrowDirectionRight :width="40" :height="40" :color="'#fff'" />
          </button>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped lang="scss">
@import "../../assets/styles/modules/product-header.module.scss";

.product--section {}
</style>
