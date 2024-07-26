<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card>
          <v-card-title class="text-h5">Страница авторизации</v-card-title>
          <v-card-text>
            <LoginForm @loginSuccess="handleLoginSuccess" />
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
const LoginForm = defineAsyncComponent(() => import('../components/LoginForm.vue'));
import { useRouter } from 'vue-router';

export default defineComponent({
  components: {
    LoginForm,
  },
  setup() {
    const router = useRouter();

    const handleLoginSuccess = () => {
      router.push('/note');
    };

    return {
      handleLoginSuccess,
    };
  },
});
</script>