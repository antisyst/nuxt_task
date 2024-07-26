<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">Мои заметки</v-card-title>
          <v-card-text>
            <NoteList />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const NoteList = defineAsyncComponent(() => import('../components/NoteList.vue'));

export default defineComponent({
  components: {
    NoteList,
  },
});
</script>