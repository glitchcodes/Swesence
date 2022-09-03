<template>
  <div class="navigation">
    <el-button type="primary" :icon="Back" @click="emit('change-page', 'HomePage')" />
    <span class="header-title fw-bold fs-4 ml-3">Settings</span>
  </div>

  <div class="settings">
    <!-- Check for updates -->
    <el-row class="align-items-center mb-5">
      <el-col :span="12">
        <div class="fw-bold">Check for updates</div>

        <el-alert title="Check for new games in the supported game list" type="info" :closable="false" />
      </el-col>
      <el-col :span="12">
        <el-button v-if="!isCheckUpdateBlocked" type="primary" :icon="Refresh" @click="">
          Check for updates
        </el-button>
        <el-button v-else type="primary" :icon="Refresh" disabled>
          Check for updates
        </el-button>
      </el-col>
    </el-row>
    <!-- END Check for updates -->

    <!-- Application ID -->
    <el-row class="align-items-center">
      <el-col :span="12">
        <div class="fw-bold">Discord Application ID</div>
        <el-alert type="warning" :closable="false">
          <slot name="title">
            Not recommended to change. More info <a href="#" target="_blank">here</a>
          </slot>
        </el-alert>
      </el-col>
      <el-col :span="12">
        <el-form-item>
          <el-input v-model="settings.applicationId" size="large" />
        </el-form-item>
      </el-col>
    </el-row>
    <!-- END Application ID -->
  </div>

</template>

<script setup>
  import { reactive, computed, onMounted } from 'vue';
  import { ElButton, ElRow, ElCol, ElFormItem, ElInput, ElAlert } from 'element-plus'
  import { Back, Refresh } from '@element-plus/icons-vue'

  const emit = defineEmits(['change-page'])

  const settings = reactive({})

  // Block checking of updates if application id is changed.
  const isCheckUpdateBlocked = computed(() => {
    return settings.applicationId !== '1010070024997851137';
  })

  onMounted(async () => {
    const data = await window.api.send('fetchSettings')

    Object.assign(settings, data)
  })
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
</style>