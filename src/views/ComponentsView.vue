<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'componentsList' }">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" /> {{ $t('common.back') }}
            </router-link>

            <div class="deleting text-center" v-show="deleting || deleted">
              <div v-bind:class="[{ 'load-complete': deleted }, 'circle-loader circle-text']">
                <div class="checkmark draw" v-show="deleted"></div>
              </div>
              <div v-if="deleting && !deleted">
                {{ $t('common.please_wait') }}
              </div>
            </div>


            <div class="row row-form view" v-show="!deleting && !deleted">
              <div class="col-md-3">
                <picture-changer ref="pictureChanger"></picture-changer>
              </div>

              <div class="col-md-7">
                <h1 class="view__title">{{ name }}</h1>
                <p>by <strong>{{ username }}</strong></p>
                <p>{{ $t("domain.component.price") }}: <strong>{{ price }} SEED</strong></p>
                <p>
                  {{ $t("domain.component.category") }}:
                  {{ $t(`domain.component_categories.${category}`) }}
                </p>
                <p>
                  {{ $t("components.updated") }}
                  {{ updatedAt | toDate('short') }}
                </p>
                </div>
                <div class="col-md-2">
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="editComponent()">{{ $t('common.modify') }}</button>
                  <button type="submit" class="btn btn-sm btn-danger btn-block mb-2" @click="confirmDelete()">{{ $t('common.delete') }}</button>
                </div>
              </div>
              <div class="row view">
                <div class="col-md-3">
                  <div class="rating">
                    <star-rating :rating="3.5" :increment="0.5" :star-size="26" :show-rating="false" :inline="true" :read-only="true"></star-rating>
                  </div>
                </div>
                <div class="col-md-9">

                  <ul class="nav nav-underline">
                    <li class="nav-item active">
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'description' }]">
                      <a class="nav-link" style="padding-left:0px" @click="selectedTab='description'">{{ $t("domain.component.description") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'properties' }]">
                      <a class="nav-link" @click="selectedTab='properties'">{{ $t("domain.component.properties") }} ({{ properties.length }})</a>
                    </li>
                  </ul>

                  <div v-show="selectedTab === 'description'">
                    <h2 class="view__subtitle">{{ $t("domain.component.description") }}</h2>
                    <p>{{ description }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.url") }}</h2>
                    <p><a :href="url" target="_blank">{{ url }}</a></p>

                    <h2 class="view__subtitle">{{ $t("domain.component.key") }}</h2>
                    <p>{{ key }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.function_name") }}</h2>
                    <p>{{ functionName }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.component.status") }}</h2>
                    <p>{{ $t(`domain.component_statuses.${status}`) }}</p>
                  </div>


                  <div v-show="selectedTab === 'properties'">
                    <div v-show="!showPropertyForm">
                      <h2 class="view__subtitle">{{ $t("domain.component.properties") }}</h2>
                      <div class="no_properties" v-show="properties.length === 0">{{ $t("properties.there_are_no_properties") }}</div>
                      <draggable v-model="properties" class="list-group" tag="ul" v-bind="dragOptions"
                        @start="drag = true" @end="drag = false"
                        @change="reorderProperties" ghost-class="ghost" v-show="properties.length > 0">
                        <transition-group type="transition" :name="!drag ? 'flip-list' : null">
                          <li class="list-group-item" v-for="property in properties" :key="property._id">
                            <img style="margin-right: 10px;":src="require('@/assets/icons/outline-icon-drag-24px.svg')" />
                            <a class="list-group-item-link" @click="modifyProperty(property)">{{ property.name }}</a>
                            <a class="list-group-item-delete icon-hover" @click="confirmDeleteProperty(property._id)">
                              <img :src="require('@/assets/icons/outline-icon-delete-24px.svg')" />
                            </a>
                          </li>
                        </transition-group>
                      </draggable>
                      <button type="submit" class="btn btn-sm btn-primary mb-2 addNewButton smallButton" @click="addProperty()">+ {{ $t('properties.new_property') }}</button>
                    </div>

                    <div class="propertyForm" v-show="showPropertyForm">
<validation-box id="_" :validationErrors="validationErrors"></validation-box>

                      <h2 class="view__subtitle mb-4">{{ propertyName === ""? $t("properties.new_property"): $t("properties.modify_property") }}</h2>

                      <div class="saving text-center" v-show="saving || saved">
                        <div v-bind:class="[{ 'load-complete': saved }, 'circle-loader circle-text']">
                          <div class="checkmark draw" v-show="saved"></div>
                        </div>
                        <div v-if="saving && !saved">
                          {{ $t('common.please_wait') }}
                        </div>
                      </div>

                      <form @submit.prevent="saveProperty" v-show="!saving">
                        <div class="form-row">
                          <div class="form-group col-md-12">
                            <input-text id="name" v-model="propertyName" :label="$t('domain.property.name')"
                              :placeholder="$t('domain.property.name_placeholder')" icon="outline-icon-fingerprint-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                          <div class="form-group col-md-12">
                            <input-select id="inputType" v-model="propertyInputType" :options="propertyInputTypes"
                              :label="$t('domain.property.input_type')"
                              icon="outline-icon-widgets-24px.svg"
                              :validationErrors="validationErrors"></input-select>
                          </div>
                          <div class="form-group col-md-12" v-show="propertyInputType === 'select'">
                            <input-text id="options" v-model="propertyOptions" :label="$t('domain.property.options')"
                              :placeholder="$t('domain.property.options_placeholder')" icon="outline-icon-list-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                          <div class="form-group col-md-12">
                            <input-select id="required" v-model="propertyRequired" :options="propertyRequiredOptions"
                              :label="$t('domain.property.required')"
                              icon="outline-icon-toggle-24px.svg"
                              :validationErrors="validationErrors"></input-select>
                          </div>
                          <div class="form-group col-md-12">
                            <input-text id="key" v-model="propertyKey"
                              :label="$t('domain.property.key')"
                              :placeholder="$t('domain.property.key_placeholder')"
                              icon="outline-icon-label-24px.svg"
                              :validationErrors="validationErrors"></input-text>
                          </div>
                        </div>
                        <div class="form-row">
                          <div class="form-group col-md-4 mt-2">
                            <input type="submit" id="submit" :value="$t('common.save')"
                              class="btn btn-lg btn-primary mr-2"/>
                            <input type="button" id="cancel" :value="$t('common.cancel')"
                              class="btn btn-lg btn-secondary" @click="cancelPropertyForm"/>
                          </div>
                        </div>
                      </form>
                    </div>

                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';
import PictureChanger from 'seed-theme/src/components/PictureChanger.vue';
import StarRating from 'vue-star-rating';
import draggable from 'vuedraggable';
import { mapGetters } from 'vuex';
export default {
  name: 'ComponentsView',
  components: {
    AppLayout,
    StarRating,
    PictureChanger,
    draggable
  },
  data() {
    return {
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      saving: false,
      saved: false,
      selectedTab: 'description',
      componentType: 'service',
      category: 'general',
      name: '',
      description: '',
      key: '',
      functionName: '',
      url: '',
      pictureUrl: '',
      price: '',
      status: 'enabled',
      picture: '',
      properties: [],
      username: '',
      updatedAt: '',
      validationErrors: [],

      showPropertyForm: false,
      propertyId: '',
      propertyName: '',
      propertyInputType: 'text',
      propertyOptions: '',
      propertyRequired: 'yes',
      propertyKey: '',

      drag: false
    };
  },
  created() {
    this.getData()
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get('/api/components/' + this.$route.params.id)
        .then((result) => {
          this.loading = false;
          this.componentType = result.data.componentType;
          this.category = result.data.category;
          this.name = result.data.name;
          this.description = result.data.description;
          this.key = result.data.key;
          this.functionName = result.data.functionName;
          this.url = result.data.url;
          this.price = result.data.price;
          this.status = result.data.status;
          this.picture = result.data.picture;
          this.properties = result.data.properties;
          this.pictureUrl = result.data.pictureUrl;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
          this.$refs.pictureChanger.loadImage(
            this.pictureUrl,
            `${this.$route.params.id}.jpg`,
            `/api/components/${this.$route.params.id}/change-picture`
          );
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    editComponent() {
      const id = this.$route.params.id;
      this.$router.push({ name: 'componentsForm', params: { id } });
    },
    confirmDelete() {
      const id = this.$route.params.id;
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('components.delete_this_component'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('common.delete'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true
      })
        .then(value => {
          if (value === true) {
            this.deleteComponent();
          }
        })
        .catch(err => {
          this.oops = true;
        })
    },
    deleteComponent() {
      this.validationErrors = [];
      this.deleting = true;
      this.deleted = false;
      const id = this.$route.params.id;
      this.axios.post('/api/components/delete', {
        id: id,
      })
        .then((result) => {
          this.deleting = false;
          this.deleted = true;
          this.$router.push({ name: 'componentsList' });
        })
        .catch((error) => {
          this.deleting = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
    addProperty() {
      this.saving = false;
      this.saved = false;
      this.propertyId = '';
      this.propertyName = '';
      this.propertyInputType = 'text';
      this.propertyOptions = '';
      this.propertyRequired = 'yes';
      this.propertyKey = '';
      this.showPropertyForm = true;
    },
    modifyProperty(p) {
      this.saving = false;
      this.saved = false;
      this.propertyId = p._id;
      this.propertyName = p.name;
      this.propertyInputType = p.inputType;
      this.propertyOptions = p.options;
      this.propertyRequired = p.required;
      this.propertyKey = p.key;
      this.showPropertyForm = true;
    },
    saveProperty() {
      this.validationErrors = [];
      this.saving = true;
      this.saved = false;
      this.axios.post('/api/components/property/save', {
        id: this.$route.params.id,
        propertyId: this.propertyId,
        propertyName: this.propertyName,
        propertyInputType: this.propertyInputType,
        propertyOptions: this.propertyOptions,
        propertyRequired: this.propertyRequired,
        propertyKey: this.propertyKey,
      })
        .then((result) => {
          this.saving = false;
          this.saved = true;
          this.showPropertyForm = false;
          this.getData();
        })
        .catch((error) => {
          this.saving = false;
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
    cancelPropertyForm() {
      this.showPropertyForm = false;
    },
    confirmDeleteProperty(propertyId) {
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('properties.delete_this_property'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('common.delete'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true
      })
        .then(value => {
          if (value === true) {
            this.deleteProperty(propertyId);
          }
        })
        .catch(err => {
          this.oops = true;
        })
    },
    deleteProperty(propertyId) {
      const id = this.$route.params.id;
      this.axios.post('/api/components/property/delete', {
        id: id,
        propertyId: propertyId
      })
        .then((result) => {
          this.getData();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    },
    reorderProperties() {
      let newOrder = [];
      for (let i = 0; i < this.properties.length; i++) {
        newOrder.push(this.properties[i]._id);
      }
      const id = this.$route.params.id;
      this.axios.post('/api/components/property/reorder', {
        id: id,
        propertyIds: newOrder.join(',')
      })
        .then((result) => {
          // this.getData();
        })
        .catch((error) => {
          if (error.response.status === 422) {
            this.validationErrors = this.normalizeErrors(error.response);
          } else {
            this.oops = true;
          }
        });
    }
  },
  computed: {
    ...mapGetters(['allPropertyInputTypes']),
    propertyInputTypes() {
      const inputTypeList = [];
      for (let i = 0; i < this.allPropertyInputTypes.length; i++) {
        inputTypeList.push({
          value: this.allPropertyInputTypes[i],
          text: this.$i18n.t(`domain.property_input_types.${this.allPropertyInputTypes[i]}`),
        });
      }
      return inputTypeList;
    },
    propertyRequiredOptions() {
      return [
        { value: 'yes', text: this.$i18n.t('common.yes')},
        { value: 'no', text: this.$i18n.t('common.no')}
      ];
    },
    dragOptions() {
      return {
        animation: 200,
        group: 'description',
        disabled: false,
        ghostClass: 'ghost'
      };
    }
  },
};
</script>

<style lang="scss" scoped>

.view {

  color: #686b77;
  font-size: 16px;

  &__image {
    width: 100%;
    border-radius: 1rem !important;
  }

  &__title {
    font-size: 1.5rem;
    color: #212529;
  }

  &__subtitle {
    margin-top: 2rem;
    font-size: 1.2rem;
    color: #212529;
  }

  &__updatedAt {
    margin-left: 20px;
  }
}

.rating {
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: 2rem;
}

.deleting {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

.addNewButton {
  margin-top: 2rem;
}

.smallButton {
  height: 32px;
}

.no_properties {
  color: #686b77;
  font-size: 16px;
  text-align: left;
  margin-top: 2rem;
}

.propertyForm {
  margin-top: 2rem;
}

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
