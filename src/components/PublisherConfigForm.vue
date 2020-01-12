<template>
  <div class="row row-form my-4">
    <div class="col-md-3 mb-4">
      <h4>
        <img :src="config.pictureUrl" class="component-logo-small" />{{ config.name }}
      </h4>
    </div>
    <div class="col-md-9">
      <form @submit.prevent="saveConfig">
        <div v-for="(collectionName, index) in collectionNames" :key="index">
          <template v-if="typeof config[collectionName] !== 'undefined'
            && config[collectionName].length > 0">
            <h5 class="my-4">{{ $t(`domain.component.${collectionName}`) }}</h5>
            <component v-for="(property, _id) in config[collectionName]"
              :key="_id"
              :is="findInputType(property)"
              :label="property.name"
              :tooltip="property.tooltip"
              :id="property._id"
              :name="property._id"
              @input="updateValues(property._id, $event)"
              :value="values.values.get(property._id)"
              :validationErrors="validationErrors"
              v-bind="property">
            </component>
          </template>
        </div>
        <div class="form-row">
          <div class="form-group col-md-4 mt-2">
            <input type="submit" id="submit" :value="$t('common.save')"
              class="btn btn-lg btn-primary px-5 font-weight-bold"/>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import ConfigInputSelect from '@/components/ConfigInputSelect.vue';
import ConfigInputText from '@/components/ConfigInputText.vue';
import ConfigInputTextarea from '@/components/ConfigInputTextarea.vue';

export default {
  name: 'PublisherConfigForm',
  components: {
    ConfigInputSelect,
    ConfigInputText,
    ConfigInputTextarea,
  },
  props: ['config', 'values'],
  setup(props, context) {
    const data = reactive({
      validationErrors: [],
      collectionNames: ['properties', 'headers', 'predefinedVars', 'mappedVars'],
    });

    function findInputType(property) {
      let sControl = '';
      switch (property.inputType) {
        case 'text':
          sControl = 'ConfigInputText';
          break;
        case 'textarea':
          sControl = 'ConfigInputTextarea';
          break;
        case 'select':
          sControl = 'ConfigInputSelect';
          break;
        default:
          // do nothing
      }
      return sControl;
    }

    function saveConfig() {
      context.emit('save-config', { values: props.values });
    }

    function updateValues(fieldName, value) {
      props.values.values.set(fieldName, value);
    }

    return {
      ...toRefs(data), findInputType, saveConfig, updateValues,
    };
  },
};
</script>

<style lang="scss" scoped>
.component-logo-small {
  margin-right: 15px;
  vertical-align: middle;
  width: 26px;
  border-radius: 5px;
}
</style>
