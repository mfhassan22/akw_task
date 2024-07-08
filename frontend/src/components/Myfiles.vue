<script lang="ts" setup>
    import axios from 'axios'
    import { ref } from 'vue';
    import { useUserStore } from '../stores/userStore';
    import FilesContract from '../contract/FilesContract'
import App from '../App.vue';

    const userStore = useUserStore()
    const id=ref<number|null>(null)
    const name = ref('')
    const image = ref<File | null>(null)

    const API:string='http://localhost:3333/';

    const handleFileUpload = (event: Event) => {
      const target = event.target as HTMLInputElement
      if (target.files && target.files.length > 0) {
        image.value = target.files[0]
      }
    }
    

    const images=ref<FilesContract[]|null>(null)

    const selectedImage=ref<FilesContract|null>(null)

    filesList();
    async function filesList(){
      images.value= await userStore.userFiles(userStore.user!.id);
    }

    const submitForm = async () => {
      const formData = new FormData()
      let uploadUrl=API+'upload';
      let requestMethod='post'
      
      if(selectedImage.value==null){
        if (!image.value) return
        formData.append('image', image.value)
      }
      if(selectedImage.value && id.value){
        formData.append('image', image.value)
        formData.append('id',id.value)
        requestMethod='put'
      }

      formData.append('file_name', name.value)
      
      
      if(selectedImage.value){
        
      }
      try {
        const response = await axios({
          method: requestMethod,
          url: uploadUrl,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userStore.token}`
          }
        }).finally(() => {
          filesList();
        });
        console.log('Form submitted successfully:', response.data)
      } catch (error) {
        console.error('Error submitting form:', error)
      }
    }

    const selectForUpdate=(item:FilesContract)=>{
      selectedImage.value=item;
      id.value=item.id;
      name.value=item.fileName;
    }

    const deleteFile = async(id:number)=>{
      await axios.delete(API+"upload/"+id,{
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${userStore.token}`
          }})
      filesList();
    }
    
</script>
<template>
    <div class="font-bold">My Files</div>
    <div class="flex w-full mt-10">
        <div class="flex-1 p-5" >
            <ul class="flex flex-col pl-1">

                <li v-for="item in images" class="border-b py-2 dark:border-gray-600 flex justify-between">
                    <span class="dark:text-gray-300 flex items-center font-thin">{{item.id}}</span>
                    <span class="dark:text-gray-300 flex items-center font-bold"><p>{{item.fileName}}</p></span>
                    <img :src="API+'uploads/' + item.imagePath" class="w-auto h-20" ></img>
                    <div class="flex items-center">
                    <span @click="selectForUpdate(item)" class=" bg-gray-400 hover:bg-gray-700 text-white font-thin text-sm px-2 py-1 h-fit rounded-full">
                      edit
                    </span>
                    <span @click="deleteFile(item.id)" class=" bg-red-400 hover:bg-gray-700 text-white font-thin ml-1 text-sm px-2 py-1 h-fit rounded-full">
                      delete
                    </span>
                  </div>
                </li>
            </ul>
        </div>
    <div class="flex-1 mr-5">
        <form @submit.prevent="submitForm" class="bg-gray-50 p-10 rounded">
          <div v-if="selectedImage">
            <label class="block mb-2 text-sm font-thin" for="id">Id:</label>
            <input type="text" id="id" disabled class="px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800" v-model="id" required>
          </div>
          <div>
            <label class="block mb-2 text-sm font-thin" for="name">Name:</label>
            <input type="text" id="name" class="px-3 py-2 border rounded-md border-gray-300 bg-gray-50 text-gray-800" v-model="name"required>
          </div>
          <div>
            <label class="block mb-2 text-sm font-thin"  for="image">Image:</label>
            <input type="file" id="image" @change="handleFileUpload" >
          </div>
          <div class="flex justify-end">
            <button v-if="selectedImage" @click="selectedImage=null;id=null;name='';" class="px-5 py-1 mt-2 font-semibold rounded-md bg-orange-300 text-gray-50 justify-self-end" type="submit">Reset</button>
            <button class="px-5 py-1 mt-2 ml-2 font-semibold rounded-md bg-sky-600 text-gray-50 justify-self-end" type="submit">{{selectedImage?"Update":"Upload"}}</button>
          </div>
      </form>
    </div>
</div>
</template>