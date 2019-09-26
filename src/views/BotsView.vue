<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body">

            <router-link class="nav-link back" :to="{ name: 'botsList' }">
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

                <div v-if="pricingModel === 'free'">
                  <p>{{ $t("domain.bot.price") }}: <strong>
                  {{ $t('common.free') }}
                  </strong></p>
                </div>
                <div v-if="pricingModel === 'pay_per_use' || pricingModel === 'pay_per_use_or_month'">
                  <p>{{ $t("domain.bot.price_per_use") }}: <strong>
                    {{ pricePerUse }} SEED
                  </strong></p>
                </div>
                <div v-if="pricingModel === 'pay_per_month' || pricingModel === 'pay_per_use_or_month'">
                  <p>{{ $t("domain.bot.price_per_month") }}: <strong>
                    {{ pricePerMonth }} SEED
                  </strong></p>
                </div>

                <p>
                  {{ $t("domain.bot.category") }}:
                  {{ $t(`domain.bot_categories.${category}`) }}
                </p>
                <p>
                  {{ $t("bots.updated") }}
                  {{ updatedAt | toDate('short') }}
                </p>
                </div>
                <div class="col-md-2">
                  <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="editBot()">{{ $t('common.modify') }}</button>
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
                      <a class="nav-link" style="padding-left:0px" @click="selectedTab='description'">{{ $t("domain.bot.description") }}</a>
                    </li>
                    <li v-bind:class="['nav-item', { 'active': selectedTab === 'features' }]">
                      <a class="nav-link" @click="selectedTab='features'">{{ $t("domain.bot.features") }}</a>
                    </li>
                  </ul>

                  <div v-show="selectedTab === 'description'">
                    <h2 class="view__subtitle">{{ $t("domain.bot.description") }}</h2>
                    <p>{{ description }}</p>

                    <h2 class="view__subtitle">{{ $t("domain.bot.status") }}</h2>
                    <p>{{ $t(`domain.bot_statuses.${status}`) }}</p>
                  </div>


                  <div v-show="selectedTab === 'features'">
                    <h2 class="view__subtitle"></h2>
                    <p class="nl2br">{{ features }}</p>
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
import { mapGetters } from 'vuex';

export default {
  name: 'BotsView',
  components: {
    AppLayout,
    StarRating,
    PictureChanger,
  },
  data() {
    return {
      loading: false,
      oops: false,
      deleting: false,
      deleted: false,
      selectedTab: 'description',
      category: 'general',
      name: '',
      description: '',
      features: '',
      pictureUrl: '',
      pricingModel: 'free',
      pricePerUse: '',
      pricePerMonth: '',
      status: 'enabled',
      picture: '',
      username: '',
      updatedAt: '',
      botengine: {},
      services: [],
      channels: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get(`/api/bots/${this.$route.params.id}`)
        .then((result) => {
          this.loading = false;
          this.category = result.data.category;
          this.name = result.data.name;
          this.description = result.data.description;
          this.features = result.data.features;
          this.pricingModel = result.data.pricingModel;
          this.pricePerUse = result.data.pricePerUse;
          this.pricePerMonth = result.data.pricePerMonth;
          this.status = result.data.status;
          this.picture = result.data.picture;
          this.pictureUrl = result.data.pictureUrl;
          this.username = result.data.username;
          this.updatedAt = result.data.updatedAt;
          this.botengine = result.data.botEngine;
          this.services = result.data.services;
          this.channels = result.data.channels;
          this.$refs.pictureChanger.loadImage(
            this.pictureUrl,
            `${this.$route.params.id}.jpg`,
            `/api/bots/${this.$route.params.id}/change-picture`,
          );
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    },
    editBot() {
      const { id } = this.$route.params;
      this.$router.push({ name: 'botsForm', params: { id } });
    },
    confirmDelete() {
      const { id } = this.$route.params;
      this.$bvModal.msgBoxConfirm(' ', {
        title: this.$i18n.t('bots.delete_this_bot'),
        size: 'md',
        buttonSize: 'md',
        okVariant: 'danger',
        okTitle: this.$i18n.t('common.delete'),
        cancelTitle: this.$i18n.t('common.no'),
        footerClass: 'p-2',
        hideHeaderClose: true,
        centered: true,
      })
        .then((value) => {
          if (value === true) {
            this.deleteBot();
          }
        })
        .catch((err) => {
          this.oops = true;
        });
    },
    deleteBot() {
      this.validationErrors = [];
      this.deleting = true;
      this.deleted = false;
      const { id } = this.$route.params;
      this.axios.post('/api/bots/delete', {
        id,
      })
        .then((result) => {
          this.deleting = false;
          this.deleted = true;
          this.$router.push({ name: 'botsList' });
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

</style>
