<template>
  <div class="navigation" :class="{ 'shadow': isScrolled }">
    <el-button type="primary" :icon="Back" @click="emit('change-page', 'HomePage')" />
    <span class="header-title fw-bold fs-4 ml-3">Settings</span>

    <el-button type="primary" plain class="float-right" @click="updateSettings">
      Save Changes
    </el-button>
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

    <!-- Enable Advanced Settings -->
    <el-row class="align-items-center my-5">
      <el-col :span="12">
        <div class="fw-bold">Enable Advanced Settings</div>

        <el-alert title="For advanced people only." type="warning" :closable="false" />
      </el-col>
      <el-col :span="12">
        <el-switch
            v-model="advancedMode"
            size="large"
            active-text="Enable"
            inactive-text="Disable"
        />
      </el-col>
    </el-row>
    <!-- END Enable Advanced Settings -->

    <el-divider />

    <!-- Application ID -->
    <el-row class="align-items-center my-5">
      <el-col :span="12">
        <div class="fw-bold">Discord Application ID</div>
        <el-alert type="info" :closable="false">
          <template #title>
            Customize the Rich Presence. More info <a href="#" target="_blank">here</a>
          </template>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-input v-model="settings.applicationId" size="large" :disabled="!advancedMode" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- END Application ID -->

    <!-- Application ID -->
    <el-row class="align-items-center mb-5">
      <el-col :span="12">
        <div class="fw-bold">Game Database URL</div>
        <el-alert type="info" :closable="false">
          <template #title>
            Use a different game database. More info <a href="#" target="_blank">here</a>
          </template>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-input v-model="settings.databaseUrl" size="large" :disabled="!advancedMode" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- END Application ID -->
  </div>

</template>

<script setup>
  import { ref, reactive, computed } from "vue";
  import { useFetch, useOnline, useLocalStorage } from '@vueuse/core'
  import { ElButton, ElRow, ElCol, ElFormItem, ElInput, ElAlert, ElIcon, ElMessage, ElSwitch, ElDivider } from 'element-plus'
  import { Back, Refresh } from '@element-plus/icons-vue'

  const emit = defineEmits(['change-page'])

  const isOnline = useOnline()
  const advancedMode = useLocalStorage('advanced-mode', false)
  const settings = reactive(await window.api.send('fetchSettings'))

  // Listen for scroll event to display shadow
  const scrollPosition = ref(0)
  const isScrolling = ref(false)

  document.addEventListener('scroll', () => {
    isScrolling.value = true
  })

  // Throttle scroll events
  setInterval(() => {
    if (isScrolling.value) {
      isScrolling.value = false
      scrollPosition.value = document.body.getBoundingClientRect().top
    }
  }, 100)

  const isScrolled = computed(() => {
    return scrollPosition.value !== 0
  })

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
    background-color: #242424;
    position: fixed;
    top: 0;
    left: 0;
    padding: 1.5em 2em;
    width: calc(100% - 4em);
    text-align: initial;
    transition: 0.2s;
    z-index: 999;
  }

  .settings {
    text-align: initial!important;
    margin-top: 5rem;
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