<script lang="ts" setup>
  import { ref } from 'vue';
  import { useUserStore } from '../stores/userStore';
  import Vue3Datatable from "@bhplugin/vue3-datatable";
  import "@bhplugin/vue3-datatable/dist/style.css";
  import { VueToggles } from "vue-toggles";

  const userStore = useUserStore()

  userStore.getUsersList();

  const fields = ref([
    {title: 'Id',field: 'id'},
    {title: 'Email',field: 'email'},
    {title: 'is Admin',field: 'isAdmin'}
  ]);
  function updateUserRole(id:number){
    userStore.changeUserRole(id);
    userStore.getUsersList();
  }
</script>
<template>
    <div class="font-bold">My Files</div>
    <div class="flex w-full mt-10">
        <div class="flex-1 p-5" >
          <vue3-datatable :rows="userStore.users" :columns="fields">
            <template #isAdmin="data">
              <VueToggles :value="data.value.isAdmin" @click="updateUserRole(data.value.id)" />
            </template>            
          </vue3-datatable>
        </div>
</div>
</template>