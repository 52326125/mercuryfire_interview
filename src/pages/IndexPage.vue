<template>
  <q-page class="row q-pt-xl">
    <div class="full-width q-px-xl">
      <div class="q-mb-xl">
        <q-btn color="primary" class="q-mt-md" @click="handleCreateClick"
          >新增</q-btn
        >
      </div>

      <div>
        <q-table
          flat
          bordered
          ref="tableRef"
          :rows="blockData"
          :columns="(tableConfig as QTableProps['columns'])"
          row-key="id"
          hide-pagination
          separator="cell"
          :rows-per-page-options="[0]"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th v-for="col in props.cols" :key="col.name" :props="props">
                {{ col.label }}
              </q-th>
              <q-th></q-th>
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props">
              <q-td
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                style="min-width: 120px"
              >
                <div>{{ col.value }}</div>
              </q-td>
              <q-td
                class="text-right"
                auto-width
                v-if="tableButtons.length > 0"
              >
                <q-btn
                  @click="handleClickOption(btn, props.row)"
                  v-for="(btn, index) in tableButtons"
                  :key="index"
                  size="sm"
                  color="grey-6"
                  round
                  dense
                  :icon="btn.icon"
                  class="q-ml-md"
                  padding="5px 5px"
                >
                  <q-tooltip
                    transition-show="scale"
                    transition-hide="scale"
                    anchor="top middle"
                    self="bottom middle"
                    :offset="[10, 10]"
                  >
                    {{ btn.label }}
                  </q-tooltip>
                </q-btn>
              </q-td>
            </q-tr>
          </template>
          <template v-slot:no-data="{ icon }">
            <div
              class="full-width row flex-center items-center text-primary q-gutter-sm"
              style="font-size: 18px"
            >
              <q-icon size="2em" :name="icon" />
              <span> 無相關資料 </span>
            </div>
          </template>
        </q-table>
        <q-inner-loading :showing="isLoading">
          <q-spinner-gears size="50px" color="primary" />
        </q-inner-loading>
      </div>
    </div>
    <UserForm v-model="isFormDialogOpen" :user="editData" />
    <q-dialog v-model="isDeletionConfirmOpen">
      <q-card>
        <q-card-section class="row items-center">
          是否確定刪除該筆資料？
        </q-card-section>

        <q-card-actions align="right">
          <q-btn
            flat
            label="取消"
            color="primary"
            @click="isDeletionConfirmOpen = false"
          />
          <q-btn flat label="確定" color="primary" @click="handleDelete" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup lang="ts">
import axios from 'axios';
import { QTableProps, useQuasar } from 'quasar';
import { deleteUser, getUserTable } from 'src/api';
import UserForm from 'src/components/UserForm.vue';
import { User } from 'src/interface/api';
import { onMounted, ref, watch } from 'vue';

interface btnType {
  label: string;
  icon: string;
  status: string;
}

const $q = useQuasar();

const isLoading = ref(false);
const isFormDialogOpen = ref(false);
const isDeletionConfirmOpen = ref(false);
const editData = ref<User | undefined>(undefined);
const blockData = ref<User[]>([]);
const tableConfig = ref([
  {
    label: '姓名',
    name: 'name',
    field: 'name',
    align: 'left',
  },
  {
    label: '年齡',
    name: 'age',
    field: 'age',
    align: 'left',
  },
]);
const tableButtons = ref<btnType[]>([
  {
    label: '編輯',
    icon: 'edit',
    status: 'edit',
  },
  {
    label: '刪除',
    icon: 'delete',
    status: 'delete',
  },
]);

const tempData = ref({
  name: '',
  age: '',
});

function handleClickOption(btn: btnType, data: User) {
  editData.value = data;
  if (btn.status === 'edit') {
    isFormDialogOpen.value = true;
  } else {
    isDeletionConfirmOpen.value = true;
  }
}

const handleCreateClick = () => {
  isFormDialogOpen.value = true;
  editData.value = undefined;
};

const handleDelete = async () => {
  if (!editData.value) return;
  try {
    await deleteUser({ id: editData.value.id });
    $q.notify({
      color: 'positive',
      message: '刪除成功',
    });
    await getTableData();
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      message: '刪除失敗',
    });
  } finally {
    isDeletionConfirmOpen.value = false;
  }
};

const getTableData = async () => {
  try {
    isLoading.value = true;
    const res = await getUserTable();
    blockData.value = res.data;
  } catch (e) {
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};
onMounted(() => getTableData());

watch(isFormDialogOpen, (val) => {
  if (!val) getTableData();
});
</script>

<style lang="scss" scoped>
.q-table th {
  font-size: 20px;
  font-weight: bold;
}

.q-table tbody td {
  font-size: 18px;
}
</style>
