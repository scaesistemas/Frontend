<template>
    <v-menu :close-on-content-click="false" :return-value.sync="localDate" transition="scale-transition"
        offset-y min-width="auto" ref="menuInicial" v-model="menuInicial">
        <template v-slot:activator="{ on, attrs }">
            <v-text-field @keydown.enter="onEnter" @keydown.tab="onDateComplete" onclick="event.preventDefault()"  v-model="localFormattedDate"
                :label="label" outlined dense append-icon="mdi-calendar-month-outline"
                class="custom-icon-field custom-text-label no-calendar-icon" type="date" v-bind="attrs" v-on="on"></v-text-field>
        </template>
        <v-date-picker v-model="localDate" scrollable>
            <v-spacer></v-spacer>
            <v-btn text color="primary" @click="menuInicial = false">Cancel</v-btn>
            <v-btn text color="primary" @click="saveDate(), menuInicial = false">OK</v-btn>
        </v-date-picker>
    </v-menu>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from "vue-property-decorator";

@Component
export default class VDataPicker extends Vue {
    @Prop({ required: true }) private label!: string;
    @Prop() private data!: string | null;
    @Prop() private formattedDate!: string | null;
    @Prop({ required: true }) private callApi!: (date: string) => void;
    @Prop() private dataType!: string;

    menuInicial:any= false;
    menuFinal: any = false;
    localDate: string = this.data || "";
    localFormattedDate: string = this.formattedDate || "";
    isProcessing: boolean = false;

    valid = true;
    dialog = false;
    immediate = true

    formatDate(date: string, format: string) {
    if (!date) return '';
    const [year, month, day] = date.split('-');
    if (format === 'yyyy-MM-dd') {
      return `${year}-${month}-${day}`;
    }
    return '';
  }
    async onEnter() {
    await this.formatDateText();
    this.saveDate()
    this.menuInicial = false;
  }

  async onDateComplete() {
    await this.formatDateText();
    this.saveDate()
    this.menuInicial = false;
}

  async formatDateText() {
    if (!this.localFormattedDate) return;

    const parts = this.localFormattedDate.split('-');
    if (parts.length === 3) {
      const ano = parseInt(parts[0], 10);
      const mes = parseInt(parts[1], 10) - 1;
      const dia = parseInt(parts[2], 10);

      if (ano < 1000 || ano > 9999 || mes < 0 || mes > 11) {
        return;
      }

      const dataInicial = new Date(ano, mes, dia);

      if (
        dataInicial.getMonth() !== mes ||
        dataInicial.getDate() !== dia ||
        dataInicial.getFullYear() !== ano
      ) {
        return;
      }

      if (!isNaN(dataInicial.getTime())) {
        this.localDate = `${ano}-${(mes + 1)
          .toString()
          .padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
      }
    }
  }
    
  saveDate() {
    if (this.localDate) {
      this.localFormattedDate = this.formatDate(this.localDate, 'yyyy-MM-dd');
      this.$emit('date-selected', { date: this.localDate, type: this.dataType });
    } 
    
  }

    mounted() {
      this.localFormattedDate = this.formattedDate || "";
    }

}

</script>

<style scoped>
  .custom-icon-field ::v-deep .v-label {
  color: var(--v-text-base);
}

.custom-icon-field ::v-deep .v-input__icon--append .v-icon {
  color: #E05A1B;
}

.no-calendar-icon ::v-deep input[type="date"]::-webkit-calendar-picker-indicator,
.no-calendar-icon ::v-deep input[type="date"]::-webkit-inner-spin-button {
  display: none;
  -webkit-appearance: none;
}
.no-calendar-icon ::v-deep input[type="date"] {
  appearance: none; /* Para suporte a outros navegadores */
}
</style>