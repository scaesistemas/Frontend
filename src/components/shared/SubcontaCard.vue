<template>
    <v-card class="credit-card rounded-xl" style="border: 1px solid gray;">
        <v-card-title class="card-title">SubConta Gerada</v-card-title>
        <v-card-text>
            <div class="credit-card-content">
                <div class="company-info">
                    <v-icon class="icon">mdi-domain</v-icon>
                    <span>{{ item.empresaNome }}</span>
                </div>
                <div class="responsavel-info">
                    <v-icon class="icon">mdi-account</v-icon>
                    <span>{{ item.ResponsavelNome }}</span>
                </div>
                <div class="subconta-info">
                    <v-icon class="icon">mdi-credit-card</v-icon>
                    <span>GalaxId: <strong>{{ item.galaxId }}</strong></span>
                </div>
                <div class="subconta-info">
                    <v-icon class="icon">mdi-key</v-icon>
                    <span>GalaxHash: <strong>{{ item.galaxHash }}</strong></span>
                </div>
            </div>
            <div class="d-flex justify-end">
                <v-icon style="font-size:60px;">mdi-integrated-circuit-chip</v-icon>
            </div>         
        </v-card-text>
    </v-card>
</template>

<script lang="ts"> 
import { Component, Prop } from "vue-property-decorator";
import { PageBase } from "@/core/models/shared";

@Component
export default class SubcontaCard extends PageBase {
    @Prop({ default: () => ({}) }) private item!: any;
}
</script>

<style scoped>
.credit-card {
    background: linear-gradient(300deg, #f05c06, #e23c29);
    color: white;
    padding: 20px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.8);
    max-width: 500px;
}

.card-title {
    font-size: 1.2rem;
    font-weight: bold;
    text-align: center;
    color: white;
}

.credit-card-content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.company-info, 
.responsavel-info,
.subconta-info {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1rem;
}

.icon {
    font-size: 1.5rem;
}
</style>
