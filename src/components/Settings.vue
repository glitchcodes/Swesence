<template>
  <div class="navigation">
    <el-button type="primary" :icon="Back" @click="emit('change-page', 'HomePage')" />
    <span class="header-title fw-bold fs-4 ml-3">Settings</span>
  </div>

  <div class="settings">
    <!-- Check for updates -->
    <el-row class="align-items-center my-5">
      <el-col :span="12">
        <div class="fw-bold">Check for updates</div>

        <el-alert title="Check for new games in the supported game list" type="info" :closable="false" />
      </el-col>
      <el-col :span="12">
        <el-button v-if="!isFetching" type="primary" :icon="Refresh" @click="checkForUpdates">
          Check for updates
        </el-button>
        <el-button v-else type="primary" :icon="Refresh" disabled>
          Check for updates
        </el-button>
        <el-icon v-show="isFetching" :size="20" class="is-loading update-icon">
          <Refresh />
        </el-icon>
      </el-col>
    </el-row>
    <!-- END Check for updates -->

    <!-- Application ID -->
    <el-row class="align-items-center mb-5">
      <el-col :span="12">
        <div class="fw-bold">Discord Application ID</div>
        <el-alert type="warning" :closable="false">
          <template #title>
            Not recommended to change. More info <a href="#" target="_blank">here</a>
          </template>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-input v-model="settings.applicationId" size="large" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- END Application ID -->

    <!-- Application ID -->
    <el-row class="align-items-center mb-5">
      <el-col :span="12">
        <div class="fw-bold">Game Database URL</div>
        <el-alert type="warning" :closable="false">
          <template #title>
            Use a different game database. More info <a href="#" target="_blank">here</a>
          </template>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-input v-model="settings.databaseUrl" size="large" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- END Application ID -->

    <!-- Update Settings -->
    <el-button type="primary" plain @click="updateSettings">
      Save Changes
    </el-button>
    <!-- END Update Settings -->
  </div>

</template>

<script setup>
  import { reactive } from "vue";
  import { useFetch, useOnline } from '@vueuse/core'
  import { ElButton, ElRow, ElCol, ElFormItem, ElInput, ElAlert, ElIcon, ElMessage } from 'element-plus'
  import { Back, Refresh } from '@element-plus/icons-vue'



  const emit = defineEmits(['change-page'])

  const isOnline = useOnline()
  const settings = reactive(await window.api.send('fetchSettings'))

  // Fetch for new list of supported games
  const url = settings.databaseUrl;
  const { data, error, statusCode, isFetching, execute } = useFetch(url, { immediate: false }).get().json()

  const checkForUpdates = async () => {
    // Stop update check if there is no internet connection
    if (!isOnline.value) {
      return ElMessage({
        message: `You're currently offline. Check your internet connection`,
        type: 'error'
      })
    }

    await execute()

    const database = await window.api.send('loadDatabase')
    const updatedDatabase = data.value

    // Check for database version
    if (database.version === updatedDatabase.version) {
      ElMessage({
        message: 'Game Database is up-to-date',
        type: 'success'
      })

      return;
    }

    // Call backend to update database
    const result = await window.api.send('updateDatabase', updatedDatabase)

    if (result.success) {
      ElMessage({
        message: 'Game Database successfully updated',
        type: 'success'
      })
    } else {
      ElMessage({
        message: 'Something went wrong while updating the database',
        type: 'error'
      })
    }

    // TODO: Handle errors
  }

  const updateSettings = async () => {
    const parsed = JSON.parse(JSON.stringify(settings))
    const result = await window.api.send('updateSettings', parsed)

    if (result.success) {
      ElMessage({
        message: 'Your settings have been updated. Restart the application to apply changes',
        type: 'success'
      })
    } else {
      ElMessage({
        message: 'Something went wrong updating your settings',
        type: 'error'
      })
    }
  }
</script>

<style scoped>
  .navigation {
    position: absolute;
    top: 1.5rem;
  }

  .settings {
    text-align: initial!important;
  }

  .header-title {
    position: relative;
    top: 4px;
  }

  .el-alert {
    display: inline-block;
    border-radius: 8px;
    font-size: 0.8rem;
    margin-top: 0.5rem;
    padding: 5px 10px;
    width: fit-content;
  }

  .update-icon {
    position: relative;
    top: 6px;
    left: 6px;
  }
</style>