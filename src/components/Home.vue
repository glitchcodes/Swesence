<template>
  <el-row class="align-items-center">
    <el-col :span="12">
      <div class="float-left mb-2">
        <img v-if="isDark" class="switch-logo" src="/switch.png" alt="Nintendo Switch Logo" />
        <img v-else class="switch-logo" src="/switch-dark.png" alt="Nintendo Switch Logo" />
      </div>

      <div class="text-align-start" style="clear: left">
        <h2>Swesence</h2>
        <p>Show your Nintendo Switch activity to Discord</p>

        <div class="mt-4">
          <el-button type="primary" :icon="Setting" plain @click="emit('change-page', 'SettingsPage')">
            Settings
          </el-button>

          <el-link href="https://google.com" target="_blank" :underline="false" class="ml-2">
            <el-button type="info" :icon="QuestionFilled" plain>
              FAQ
            </el-button>
          </el-link>
        </div>
      </div>
    </el-col>
    <el-col class="form--custom" :span="12">
      <el-form :model="form" label-position="top">
        <el-form-item label="Game">
          <el-select v-model="form.game"
                     filterable
                     remote
                     :remote-method="filterGames"
                     clearable
                     class="w-100" placeholder="Switch Game"
                     size="large" @change="getGameImage">
            <el-option
                v-for="(item, index) in filteredGames"
                :key="index"
                :label="item.title"
                :value="item.title"
                :loading="isLoading"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="Activity" class="mb-4">
          <el-input v-model="form.activity" placeholder="What are you doing right now?" size="large"></el-input>
        </el-form-item>

        <el-button type="primary" class="float-left" :icon="Position" :disabled="!hasGameSelected" @click="submitForm">
          Update Presence
        </el-button>
      </el-form>
    </el-col>
  </el-row>

  <div class="footer">
    <p class="muted">Not affiliated to Nintendo nor Discord</p>
  </div>
</template>

<script setup>
  import { ref, reactive, onMounted, computed } from "vue";

  import { ElButton, ElCol, ElForm, ElFormItem, ElInput, ElOption, ElRow, ElSelect, ElMessage, ElLink } from 'element-plus'
  import { Position, Setting, QuestionFilled } from '@element-plus/icons-vue'

  const emit = defineEmits(['change-page']);

  const props = defineProps({
    isDark: Boolean
  })

  const form = reactive({
    game: '',
    activity: '',
    image: ''
  })

  const isLoading = ref(false)

  const gameList = reactive([]);
  const filteredGames = ref([]);

  // Load game database
  onMounted(async () => {
    const database = await window.api.send('loadDatabase')

    database.games.forEach((item) => {
      gameList.push(item) // Cached list
      filteredGames.value.push(item)
    })
  })

  const hasGameSelected = computed(() => {
    return form.game.length > 0 && form.activity.length > 0
  })

  const filterGames = (value) => {
    if (!value) return filteredGames.value = gameList;

    // Enable loading state
    isLoading.value = true

    setTimeout(() => {
      const searchableKeys = ['title', 'aliases']

      filteredGames.value = gameList.filter((item) => {
        return searchableKeys.some((key) => {
          return item[key].toString().includes(value)
        })
      })

      // Disable loading state
      isLoading.value = false
    }, 200)
  }

  // Find the game image key
  const getGameImage = (value) => {
    if (!value) return;

    const result = gameList.filter((item) => {
      return item.title === value
    })

    form.image = result[0].image
  }

  const submitForm = async () => {
    const parsed = JSON.parse(JSON.stringify(form))
    const result = await window.api.send('updatePresence', parsed)

    if (result.success) {
      ElMessage({
        message: 'Your Discord presence has been updated',
        type: 'success'
      })
    }
  }
</script>

<style scoped>
.switch-logo {
  text-align: left;
  width: 32px;
}

.form--custom {
  padding: 1.5rem;
  border-radius: 10px;
}

.footer {
  color: #8d8d8b;
  width: 100%;
  position: absolute;
  bottom: 0;
  text-align: center;
  margin-left: -2rem;
}
</style>