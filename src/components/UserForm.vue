<template>
  <q-dialog v-model="writableModelValue">
    <q-card>
      <q-card-section class="row items-center">
        <q-form @submit="onSubmit">
          <q-input
            v-model="form.name"
            ref="nameRef"
            label="姓名"
            :rules="nameRule"
          />
          <q-input
            v-model="form.age"
            ref="ageRef"
            label="年齡"
            :rules="ageRule"
          />
        </q-form>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          label="取消"
          color="primary"
          @click="writableModelValue = false"
        />
        <q-btn flat :label="actionLabel" color="primary" @click="onSubmit" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>
<script setup lang="ts">
import { QInput, useQuasar } from 'quasar';
import { createUser, updateUser } from 'src/api';
import { CreateUserPayload, UpdateUserPayload, User } from 'src/interface/api';
import { computed, onMounted, ref, toRefs, watch } from 'vue';

interface UserFormProps {
  user?: User;
  modelValue: boolean;
}

interface UserForm {
  name?: string;
  age?: string;
}

const props = defineProps<UserFormProps>();
const { modelValue, user } = toRefs(props);

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
}>();

const $q = useQuasar();

const form = ref<UserForm>({
  name: '',
  age: '',
});
const nameRef = ref<QInput>();
const ageRef = ref<QInput>();

const nameRule = [(val: string) => (val && val.length > 0) || '請輸入姓名'];
const ageRule = [
  (val: string) => (val && val.length > 0) || '請輸入年齡',
  (val: string) => /^\d+$/.test(val) || '年齡只能輸入數字',
];

const writableModelValue = computed({
  get() {
    return modelValue.value;
  },
  set(val) {
    emit('update:modelValue', val);
  },
});
const isEditMode = computed(() => !!user.value);
const actionLabel = computed(() => (isEditMode.value ? '更新' : '新增'));

const onSubmit = async () => {
  if (!nameRef.value || !ageRef.value) return;

  try {
    nameRef.value.validate();
    ageRef.value.validate();
    if (nameRef.value.hasError || ageRef.value.hasError) throw Error();

    const params: CreateUserPayload = {
      name: form.value.name!,
      age: Number(form.value.age!),
    };
    console.log(params);
    if (isEditMode.value && user.value) {
      await updateUser({
        ...params,
        id: user.value.id,
      });
    } else {
      await createUser(params);
    }

    $q.notify({
      color: 'positive',
      message: actionLabel.value + '成功',
    });
    writableModelValue.value = false;
  } catch (e) {
    console.error(e);
    $q.notify({
      color: 'negative',
      message: actionLabel.value + '失敗',
    });
  }
};

const initUserForm = () => {
  if (isEditMode.value) {
    console.log(user.value);
    form.value.name = user.value?.name;
    form.value.age = user.value?.age.toString();
  } else {
    form.value.name = '';
    form.value.age = '';
  }
};

onMounted(initUserForm);

watch(modelValue, (val) => {
  if (val) initUserForm();
});
</script>
<style lang="scss" scoped></style>
