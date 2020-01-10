<template>
  <div :id="collectionName">
    <div class="d-flex flex-column flex-sm-row">
      <div class="d-flex justify-content-start flex-fill">
        <h5>{{ title }} <help-tooltip
          :tooltip="tooltip"></help-tooltip></h5>
      </div>
      <div class="d-flex justify-content-end">
        <a href="#" class="btn btn-sm btn-primary w-xs-100 font-weight-bold"
        @click.prevent="newConfig()">{{ $t('common.choose_from_list') }}</a>
      </div>
    </div>
    <div class="mt-4 mb-4 text-black-50" v-show="collection.length === 0"
      >{{ emptyMessage }}</div>
    <!-- <ul>
      <li v-for="item in collection" :key="item._id">
        <span>{{ item.name }}</span>
      </li>
    </ul> -->
    <draggable :list="collection" class="list-group" tag="ul"
      v-bind="dragOptions()" @start="drag = true" @end="drag = false"
      ghost-class="ghost" v-show="collection.length > 0">
      <transition-group type="transition"
      :name="!drag ? 'flip-list' : null">
        <li class="list-group-item" v-for="config in collection"
        :key="config.component">
          <icon icon="drag" class="mr-2" />
          <img class="component-logo-small"
          :src="cachedComponentPictureUrl(config.component)" />
          <a class="list-group-item-link"
          @click="editConfig(config.component)"
          >{{ cachedComponentName(config.component) }}</a>
          <a class="list-group-item-delete icon-hover"
          @click="confirmDeleteConfig(config.component)">
            <icon icon="delete" />
          </a>
        </li>
      </transition-group>
    </draggable>
  </div>
</template>
<script>
import draggable from 'vuedraggable';
import { reactive, toRefs } from '@vue/composition-api';
import HelpTooltip from 'seed-theme/src/components/HelpTooltip.vue';

export default {
  name: 'ConfigList',
  components: {
    draggable,
    HelpTooltip,
  },
  props: ['collection', 'collectionName', 'componentType', 'title', 'emptyMessage', 'tooltip',
    'titleEdit', 'titleDelete', 'selectTitle', 'cache'],
  setup(props, context) {
    const data = reactive({
      drag: false,
    });

    function newConfig() {
      context.emit('new-config', {
        configFormTitle: props.titleAddNew,
        configCollectionName: props.collectionName,
        configCollectionIndex: -1,
        configSelectTitle: props.selectTitle,
        configComponentType: props.componentType,
      });
    }

    function getIndex(componentId) {
      for (let i = 0; i < props.collection.length; i++) {
        if (props.collection[i].component === componentId) {
          return i;
        }
      }
      return -1;
    }

    function editConfig(componentId) {
      const index = getIndex(componentId);
      context.emit('edit-config', {
        configCollectionName: props.collectionName,
        configCollectionIndex: index,
      });
    }

    async function confirmDeleteConfig(componentId) {
      const index = getIndex(componentId);
      const value = await context.root.$bvModal.msgBoxConfirm(
        props.titleDelete, {
          okVariant: 'danger',
          okTitle: context.root.$i18n.t('common.delete'),
          centered: true,
        },
      );
      if (value === true) {
        context.emit('delete-config', {
          configCollectionName: props.collectionName,
          configCollectionIndex: index,
        });
      }
    }

    function dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost',
      };
    }

    function cachedComponentName(componentId) {
      if (props.cache.has(componentId)) {
        return props.cache.get(componentId).name;
      }
      return componentId;
    }

    function cachedComponentPictureUrl(componentId) {
      if (props.cache.has(componentId)) {
        return props.cache.get(componentId).pictureUrl;
      }
      return componentId;
    }

    return {
      ...toRefs(data),
      newConfig,
      editConfig,
      confirmDeleteConfig,
      dragOptions,
      cachedComponentName,
      cachedComponentPictureUrl,
    };
  },
};

</script>

<style lang="scss" scoped>
// Drag
.flip-list-move {
  transition: transform 0.5s;
}
.no-move {
  transition: transform 0s;
}

.ghost {
  opacity: 0.5;
  background: #f6f6f6;
}

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
