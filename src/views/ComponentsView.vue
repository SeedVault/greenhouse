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

                <div>
                  <vue-avatar
                    :width="228"
                    :height="228"
                    :rotation="rotation"
                    :borderRadius="borderRadius"
                    :scale="scale"
                    :border= "0"
                    :image="pictureUrl"
                    :title="$t('common.click_to_change_picture')"
                    ref="vueavatar"
                    @vue-avatar-editor:image-ready="onImageReady"
                    @select-file="onFileSelected"
                    >
                  </vue-avatar>
                  <div v-show="showImageControls">
                    <br>
                    <label>
                      Zoom : {{scale}}x
                      <br>
                      <input
                        type="range"
                        min=0
                        max=3
                        step=0.02
                        v-model='scale'
                      />
                    </label>
                    <br>
                    <button v-on:click="saveClicked" class="btn btn-sm btn-primary mb-2 mr-2" style="height:30px">Save image</button>
                    <button v-on:click="saveClicked" class="btn btn-sm btn-danger mb-2" style="height:30px">No image</button>
                    <br>
                    <img ref="image">
                  </div>
                </div>

                <!-- <hr>
                <template v-if="picture === ''"><img src="/images/component-default.png" class="view__image mr-4"></template>
                <template v-else><img src="/images/component-default.png" class="view__image mr-4"></template>
                <div class="rating">
                  <star-rating :rating="3.5" :increment="0.5" :star-size="26" :show-rating="false" :inline="true" :read-only="true"></star-rating>
                </div> -->
              </div>
              <div class="col-md-9">
                <div class="row">
                  <div class="col-md-10">
                    <h1 class="view__title">{{ name }}</h1>
                <p>by <strong>{{ username }}</strong></p>

                <p>
                  {{ $t("domain.component.category") }}:
                  {{ $t(`domain.component_categories.${category}`) }}
                  <span class="view__updatedAt">{{ $t("components.updated") }}
                  {{ updatedAt | toDate('short') }}</span>
                </p>

                <p>{{ $t("domain.component.price") }}: {{ price }} SEED</p>

                  </div>
                  <div class="col-md-2">
                    <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="editComponent()">{{ $t('common.modify') }}</button>
                    <button type="submit" class="btn btn-sm btn-danger btn-block mb-2" @click="confirmDelete()">{{ $t('common.delete') }}</button>
                  </div>
                </div>



                <h2 class="view__subtitle">{{ $t("domain.component.description") }}</h2>
                <p>{{ description }}</p>

                <h2 class="view__subtitle">{{ $t("domain.component.url") }}</h2>
                <p><a :href="url" target="_blank">{{ url }}</a></p>

                <h2 class="view__subtitle">{{ $t("domain.component.function_name") }}</h2>
                <p>{{ functionName }}</p>

                <h2 class="view__subtitle">{{ $t("domain.component.status") }}</h2>
                <p>{{ $t(`domain.component_statuses.${status}`) }}</p>

                <h2 class="view__subtitle">{{ $t("domain.component.properties") }}</h2>

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
import VueAvatar from 'seed-theme/src/components/VueAvatar.vue';
import StarRating from 'vue-star-rating';
export default {
  name: 'ComponentsView',
  components: {
    AppLayout,
    StarRating,
    VueAvatar
  },
  data() {
    return {
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      componentType: 'service',
      category: 'general',
      name: '',
      description: '',
      functionName: '',
      url: '',
      pictureUrl: '',
      price: '',
      status: 'enabled',
      picture: '',
      username: '',
      updatedAt: '',
      validationErrors: [],

      showImageControls: false,
      rotation: 0,
      scale: 1,
      borderRadius: 0
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
          this.functionName = result.data.functionName;
          this.url = result.data.url;
          this.price = result.data.price;
          this.status = result.data.status;
          this.picture = result.data.picture;
          this.pictureUrl = result.data.pictureUrl;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
          this.$refs.vueavatar.loadImage(this.pictureUrl);
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
    saveClicked() {
      const self = this;
      var img = this.$refs.vueavatar.getImageScaled();
      // this.$refs.image.src = img.toDataURL('image/jpeg', 1.0);
      const canvas = document.getElementById('avatarEditorCanvas');
      canvas.toBlob(function(blob) {
        const formData = new FormData();
        formData.append('pictureFile', blob, `${self.$route.params.id}.jpg`);
        // Post via axios or other transport method
        self.axios.post(`/api/components/${self.$route.params.id}/change-picture`, formData
        )
        .then((result) => {
          console.log('uploaded!');
        }).catch((error) => {
          console.error(error);
        });
      }, 'image/jpeg', 1.0);
    },
    onImageReady() {
      this.scale = 1;
      this.rotation = 0;
    },
    onFileSelected() {
      this.showImageControls = true;
    },
  },
};
</script>

<style lang="scss" scoped>

canvas {
  width: 228px;
  height: 228px;
}

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
  margin-top: 1rem;
  margin-bottom: 2rem;
}

.deleting {
  padding-top: 100px;
  padding-bottom: 100px;
}

.circle-text {
  margin-bottom: 1em;
}

</style>
