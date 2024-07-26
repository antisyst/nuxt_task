<template>
  <v-dialog v-model="show" max-width="600px">
    <v-card>
      <v-card-title>{{ isEditing ? 'Редактировать заметку' : 'Создать заметку' }}</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="submitForm">
          <v-textarea
            v-model="noteContent"
            placeholder="Напишите вашу заметку здесь..."
            :error-messages="errors.noteContent"
            required
          ></v-textarea>
          <v-btn type="submit" class="mt-4" :loading="isLoading">{{ isEditing ? 'Сохранить' : 'Создать' }}</v-btn>
          <v-btn @click="close" class="mt-4">Закрыть</v-btn>
        </v-form>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useNotesStore } from '../store/notes';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default defineComponent({
  props: {
    show: Boolean,
    noteId: String,
  },
  setup(props, { emit }) {
    const notesStore = useNotesStore();
    const isLoading = ref(false);
    const isEditing = ref(false);

    const schema = yup.object({
      noteContent: yup.string().required('Содержание заметки обязательно'),
    });

    const { handleSubmit, errors, resetForm } = useForm({
      validationSchema: schema,
    });

    const { value: noteContent } = useField('noteContent');

    const resetState = () => {
      if (props.noteId) {
        const note = notesStore.getNoteById(props.noteId);
        noteContent.value = note ? note.content : '';
        isEditing.value = true;
      } else {
        noteContent.value = '';
        isEditing.value = false;
      }
      resetForm();
    };

    watch(
      () => props.noteId,
      resetState,
      { immediate: true }
    );

    watch(
      () => props.show,
      (newVal) => {
        if (!newVal) {
          resetState();
        }
      }
    );

    const saveNote = async () => {
      isLoading.value = true;
      try {
        if (isEditing.value) {
          await notesStore.editNote(props.noteId!, noteContent.value);
        } else {
          await notesStore.addNote(noteContent.value);
        }
        close();
      } catch (error) {
        console.error(error);
      } finally {
        isLoading.value = false;
      }
    };

    const close = () => {
      emit('close');
    };

    const submitForm = handleSubmit(saveNote);

    return {
      noteContent,
      saveNote,
      close,
      isEditing,
      isLoading,
      submitForm,
      errors,
    };
  },
});
</script>