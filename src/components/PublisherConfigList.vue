<template>
  <div :id="collectionName">
    <div class="d-flex flex-column flex-sm-row">
      <div class="d-flex justify-content-start flex-fill">
        <h5>{{ title }} <help-tooltip
          :tooltip="tooltip"></help-tooltip></h5>
      </div>
    </div>

    <ul class="list-group">
      <li class="list-group-item" v-for="(item, index) in items" :key="item._id">
         <img class="component-logo-small"
          :src="item.pictureUrl" />
        <a class="list-group-item-link" @click="editConfig(index)"
      >{{ item.name }}</a>
      </li>
    </ul>

  </div>
</template>
<script>
import { reactive, toRefs } from '@vue/composition-api';
import HelpTooltip from 'seed-theme/src/components/HelpTooltip.vue';

export default {
  name: 'PublisherConfigList',
  components: {
    HelpTooltip,
  },
  props: ['configType', 'componentType', 'items', 'collection', 'collectionName', 'title', 'emptyMessage', 'tooltip',
    'titleEdit', 'cache'],
  setup(props, context) {
    const data = reactive({

    });

    function editConfig(index) {
      context.emit('edit-config', {
        configCollectionName: props.collectionName,
        configCollectionIndex: index,
        configComponentType: props.componentType,
      });
    }

    function cachedName(id) {
      if (props.cache.has(id)) {
        return props.cache.get(id).name;
      }
      return id;
    }

    function cachedPictureUrl(id) {
      if (props.cache.has(id)) {
        return props.cache.get(id).pictureUrl;
      }
      return id;
    }

    return {
      ...toRefs(data),
      editConfig,
      cachedName,
      cachedPictureUrl,
    };
  },
};

</script>

<style lang="scss" scoped>

.list-group {
  margin-top: 1rem;
  min-height: 20px;
}

.list-group-item {
  cursor: move;
}

.list-group-item i {
  cursor: pointer;
}

a.list-group-item-link {
  color: #6b4c9f;
  cursor: pointer;
  &:hover {
    color: #6b4c9f;
    text-decoration: underline;
  }
}

a.list-group-item-delete {
  float: right;
  color: #6b4c9f;
  cursor: pointer;
  &:hover {
    color: #6b4c9f;
    text-decoration: underline;
  }
}

.component-logo-small {
  margin-right: 15px;
  vertical-align: middle;
  width: 26px;
  border-radius: 5px;
}
</style>
