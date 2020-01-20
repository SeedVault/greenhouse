<template>
  <div>
    <b-modal v-b-modal.modal-sm v-model="showDialog" id="modal-center"
      centered :title="$t('reviews.rate_and_review')">

      <full-centered v-slot:main v-if="loading">
        <loading-checkmark visible="false" :loading="loading"></loading-checkmark>
      </full-centered>

      <div class="d-flex flex-row" v-if="!loading && !saving && !saved">
        <div class="d-flex align-items-start">
          <img class="user-picture mr-2 rounded-circle" :src="user.picture" />
        </div>
        <div class="w-100">
          <div class="user-username text-truncate">{{ user.username }}</div>
          <div class="user-email text-black-50">
            {{ $t('reviews.disclamer') }}
          </div>
          <validation-box id="_" :validationErrors="validationErrors"></validation-box>

          <form @submit.prevent="save" v-show="!saving">

            <div class="mt-4">
              <star-rating :star-size="30" v-model="rating"
              :show-rating="false" :inline="true"></star-rating>
            </div>
            <input-textarea v-model="comments" id="comments"
              label="" :rows="5" style="width: 100%"
              :placeholder="$t('domain.review.comments_placeholder')"
              icon="text"
              :validationErrors="validationErrors"></input-textarea>

          </form>
        </div>
      </div>

      <template v-slot:modal-footer v-show="!loading && !saving && !saved">
        <div class="d-flex flex-row-reverse">
          <div class="">
            <input type="submit" id="submit" :value="$t('reviews.submit_review')"
            class="btn btn-primary btn-block font-weight-bold" @click="submitReview()" />
          </div>
          <div class="mr-2">
            <input type="submit" id="submit" :value="$t('common.cancel')"
            class="btn btn-light btn-block font-weight-bold" @click="showDialog=false" />
          </div>
        </div>
      </template>

    </b-modal>

    <a class="cursor-pointer" :title="$t('reviews.click_to_rate_it')"
      @click.prevent="rateIt()">
      <star-rating :rating="instanceAverageRating" :increment="0.5" :star-size="18"
      :show-rating="false" :inline="true" :read-only="true"
      style="position: relative;top: -2px;"></star-rating>
    </a> ({{ instanceReviewsCount }})
  </div>
</template>

<script>

import StarRating from 'vue-star-rating';
import { reactive, toRefs, computed } from '@vue/composition-api';

export default {
  name: 'Rating',
  components: {
    StarRating,
  },
  props: ['instanceType', 'instanceId', 'averageRating', 'reviewsCount'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      saving: false,
      saved: false,
      showDialog: false,
      rating: 1,
      comments: '',
      validationErrors: [],
      instanceAverageRating: props.averageRating,
      instanceReviewsCount: props.reviewsCount,
      user: computed(() => context.root.$store.getters.user),
    });

    async function rateIt() {
      try {
        data.showDialog = true;
        data.loading = true;
        data.saving = false;
        data.saved = false;
        const url = `/reviews/${encodeURI(props.instanceType)}/${encodeURI(props.instanceId)}`;
        const response = await context.root.axios.get(url);
        if (response.data === null) {
          data.rating = 1;
          data.comments = '';
        } else {
          data.rating = response.data.rating;
          data.comments = response.data.comments;
        }
        data.loading = false;
      } catch (error) {
        data.loading = false;
      }
    }

    async function submitReview() {
      try {
        data.validationErrors = [];
        data.saving = true;
        data.saved = false;
        const url = `/reviews/${encodeURI(props.instanceType)}/${encodeURI(props.instanceId)}`;
        const result = await context.root.axios.post(url, {
          rating: data.rating,
          comments: data.comments,
        });
        data.instanceAverageRating = result.data.averageRating;
        data.instanceReviewsCount = result.data.reviewsCount;
        data.saving = false;
        data.saved = true;
        data.showDialog = false;
      } catch (error) {
        data.saving = false;
        if (error.response.status === 422) {
          data.validationErrors = context.root.normalizeErrors(error.response);
        }
      }
    }

    return {
      ...toRefs(data),
      rateIt,
      submitReview,
    };
  },
};

</script>

<style lang="scss" scoped>

.user {
  &-picture {
    width: 35px;
    height: 35px;
  }

  &-username {
    font-size: 16px;
    line-height: 1.5rem;
  }

  &-email {
    font-size: 12px;
    line-height: 1rem;
  }
}

</style>
