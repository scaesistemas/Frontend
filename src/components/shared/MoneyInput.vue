<template>
    <money :style="`color:${textColor}; font-size: 16px;border: 1px solid #9e9e9e;padding: 8px 10px;border-radius: 4px; width: 100%; outline: 0`" @input="WatchValor" v-model="valor" v-bind="preco"/>
</template>

<script lang="ts"> 
import { Component, Prop, Watch } from "vue-property-decorator"
import { PageBase } from "@/core/models/shared";

@Component
export default class MoneyInput extends PageBase {
    @Prop() private value!: number;
    valor: number = 0;

    preco = {decimal: ',', thousands: '.', prefix: ' ', suffix: '', precision: 2, masked: false}

    created() {
        this.WatchValue(this.value);
    }

    @Watch('value')
    WatchValue(val: any){
        if (val === null) return;
        this.valor = val;
        this.$emit("ValorFormatado", this.valor);
    }

    WatchValor(val: number){
        if (val === null) return;
        this.$emit("ValorFormatado", this.valor);
        this.toggleTheme();
    }

    cor = '';
  
    toggleTheme() { 
        this.cor = JSON.parse(localStorage.sessionApp.split(".")).dados.temaEscuro == true ? 'dark' : 'light';
    }

    get textColor() {
        return this.$vuetify.theme.themes[this.cor] ? this.$vuetify.theme.themes[this.cor].text : '';
    }
}
</script>

<style scoped>
    .money-input {
        border-bottom: 2px solid #9e9e9e;  
    }
</style>