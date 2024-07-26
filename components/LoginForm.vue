<template>
  <v-form @submit.prevent="login">
    <v-text-field v-model="username" label="Имя пользователя" required :error-messages="errors.username" ></v-text-field>
    <v-text-field v-model="password" label="Пароль" type="password" required :error-messages="errors.password" ></v-text-field>
    <v-btn type="submit" :loading="isLoading">Войти</v-btn>
    <v-alert v-if="error" type="error">{{ error }}</v-alert>
  </v-form>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { useAuthStore } from '../store/auth';
import { useRouter } from 'vue-router';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

export default defineComponent({
  setup(_, { emit }) {
    const authStore = useAuthStore();
    const router = useRouter();
    const isLoading = ref(false);
    const error = ref('');

    const schema = yup.object({
      username: yup.string().required('Username is required'),
      password: yup.string().required('Password is required'),
    });

    const { handleSubmit, errors } = useForm({
      validationSchema: schema,
    });

    const { value: username } = useField('username');
    const { value: password } = useField('password');

    watch(
      () => authStore.loading,
      (newVal) => {
        isLoading.value = newVal;
      }
    );

    watch(
      () => authStore.error,
      (newVal) => {
        error.value = newVal;
      }
    );

    const login = handleSubmit(async () => {
      try {
        await authStore.login(username.value, password.value);
        emit('loginSuccess');
        router.push('/note');
      } catch (err) {
        error.value = err.message;
      }
    });

    return {
      username,
      password,
      login,
      isLoading,
      error,
      errors,
    };
  },
});
</script>