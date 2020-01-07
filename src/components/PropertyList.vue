<template>
  <div :id="collectionName">
    <div class="d-flex flex-column flex-sm-row">
      <div class="d-flex justify-content-start flex-fill">
        <h5>{{ title }}</h5>
      </div>
      <div class="d-flex justify-content-end">
        <a href="#" class="btn btn-sm btn-primary w-xs-100 font-weight-bold"
        @click.prevent="newProperty()"> + {{ $t('common.add_new') }}</a>
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
        <li class="list-group-item" v-for="property in collection"
        :key="property.name">
          <icon icon="drag" class="mr-2" />
          <a class="list-group-item-link"
          @click="editProperty(property.name)"
          >{{ property.name }}</a>
          <a class="list-group-item-delete icon-hover"
          @click="confirmDeleteProperty(property.name)">
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

export default {
  name: 'PropertyList',
  components: {
    draggable,
  },
  props: ['collection', 'collectionName', 'title', 'emptyMessage', 'titleAddNew',
    'titleEdit', 'titleDelete'],
  setup(props, context) {
    const data = reactive({
      drag: false,
    });

    function newProperty() {
      context.emit('new-property', {
        propertyFormTitle: props.titleAddNew,
        propertyCollectionName: props.collectionName,
        propertyCollectionIndex: -1,
      });
    }

    function getIndex(propertyName) {
      for (let i = 0; i < props.collection.length; i++) {
        if (props.collection[i].name === propertyName) {
          return i;
        }
      }
      return -1;
    }

    function editProperty(propertyName) {
      const index = getIndex(propertyName);
      context.emit('edit-property', {
        propertyFormTitle: props.titleEdit,
        propertyCollectionName: props.collectionName,
        propertyCollectionIndex: index,
      });
    }

    async function confirmDeleteProperty(propertyName) {
      const index = getIndex(propertyName);
      const value = context.root.$bvModal.msgBoxConfirm(
        props.titleDelete, {
          okVariant: 'danger',
          okTitle: context.root.$i18n.t('common.delete'),
          centered: true,
        },
      );
      if (value === true) {
        context.emit('delete-property', {
          propertyCollectionName: props.collectionName,
          propertyCollectionIndex: index,
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

    return {
      ...toRefs(data),
      newProperty,
      editProperty,
      confirmDeleteProperty,
      dragOptions,
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
</style>
