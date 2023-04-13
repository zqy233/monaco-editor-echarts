import { defineStore } from "pinia";

export const useOptionStore = defineStore("option", {
  state: () => ({ option: "" }),
  actions: {
    setOption(option) {
      this.option = option;
    },
  },
});
