<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-btn @click="openCreateModal" class="mb-4">Создать заметку</v-btn>
        <v-skeleton-loader v-if="notesStore.loading" type="list-item-avatar" />
        <v-alert v-if="notesStore.error" type="error">{{ notesStore.error }}</v-alert>
        <v-list v-else>
          <v-list-item v-for="note in notesStore.paginatedNotes" :key="note.id" class="mb-4">
            <v-list-item-content>
              <v-list-item-title>{{ note.content }}</v-list-item-title>
              <v-list-item-subtitle>{{ new Date(note.date).toLocaleString() }}</v-list-item-subtitle>
            </v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click="openEditModal(note.id)"><v-icon>mdi-pencil</v-icon></v-btn>
              <v-btn icon @click="openDeleteModal(note.id)"><v-icon>mdi-delete</v-icon></v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list>
        <v-btn @click="loadMore" v-if="notesStore.hasMoreNotes && !notesStore.loading" class="mt-4">Загрузить ещё</v-btn>
        <NoteModal v-if="showModal" :show="showModal" :note-id="modalNoteId" @close="closeModal" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useNotesStore } from '../store/notes';
import NoteModal from './NoteModal.vue';

export default defineComponent({
  components: {
    NoteModal,
  },
  setup() {
    const notesStore = useNotesStore();
    const showModal = ref(false);
    const modalNoteId = ref('');

    const openCreateModal = () => {
      modalNoteId.value = '';
      showModal.value = true;
    };

    const openEditModal = (id: string) => {
      modalNoteId.value = id;
      showModal.value = true;
    };

    const openDeleteModal = (id: string) => {
      const confirmed = confirm('Are you sure you want to delete this note?');
      if (confirmed) {
        notesStore.deleteNote(id);
      }
    };

    const closeModal = () => {
      showModal.value = false;
    };

    const loadMore = () => {
      notesStore.loadMore();
    };

    onMounted(() => {
      notesStore.initialize();
    });

    return {
      notesStore,
      openCreateModal,
      openEditModal,
      openDeleteModal,
      closeModal,
      loadMore,
      showModal,
      modalNoteId,
    };
  },
});
</script>