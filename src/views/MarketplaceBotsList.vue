<template>
  <div>
    <div class="fetching text-center" v-show="fetching">
      <div v-bind:class="[{ 'load-complete': !fetching }, 'circle-loader circle-text']">
      </div>
      <div v-if="fetching">
        {{ $t('common.please_wait') }}
      </div>
    </div>

    <div class="list" v-show="!fetching">
      <div class="row">
        <div class="col-6">
          <a @click="setStatus('')" v-bind:class="{'list__filter': true, 'active': status === '' }" href="#">{{ $t('domain.bot_statuses.all') }}</a>
          <a @click="setStatus('enabled')" v-bind:class="{'list__filter': true, 'active': status === 'enabled' }" href="#">{{ $t('domain.bot_statuses.enabled') }}</a>
          <a @click="setStatus('disabled')" v-bind:class="{'list__filter': true, 'active': status === 'disabled' }" href="#">{{ $t('domain.bot_statuses.disabled') }}</a>
        </div>
        <div class="col-6 list__sorting">
          {{ $t('common.sort_by') }}:
          <a @click="setSortBy('name')" v-bind:class="{'list__sort': true, 'active': sortBy === 'name' }" href="#">{{ $t('domain.bot.name') }}</a>
          <a @click="setSortBy('updatedAt')" v-bind:class="{'list__sort': true, 'active': sortBy === 'updatedAt' }" href="#">{{ $t('common.date') }}</a>
          <a @click="toggleSortType()" class="list__sort icon-hover">
            <template v-if="sortType === 'desc'">
              <img :src="require('@/assets/icons/outline-sort-desc-24px.svg')" />
            </template>
            <template v-else>
              <img :src="require('@/assets/icons/outline-sort-asc-24px.svg')" />
            </template>
          </a>
        </div>
      </div>
      <div class="list__empty" v-show="!fetching & bots.length === 0">
        {{ $t('bots.there_are_no_bots') }}
      </div>
      <div v-for="(bot, index) in bots" :key="index">
        <div class="row">
          <div class="col-sm">
            <div class="media">
              <img :src="bot.pictureUrl" class="list__image mr-4" @click="viewBot(bot._id)">
              <div class="media-body list-body mb-2">
                <h5 class="list__name mt-0">{{ bot.name }}</h5>
                <div class="list__description">{{ bot.description }}</div>
                <div class="list__misc clearfix">
                  <div class="list__rating">
                    <star-rating :rating="3.5" :increment="0.5" :star-size="18" :show-rating="false" :inline="true" :read-only="true"></star-rating>
                  </div>
                  <div class="list__category">{{ $t("domain.bot.category") }}:
                  {{ $t(`domain.bot_categories.${bot.category}`) }}
                  </div>
                  <div class="list__updated">{{ $t("bots.updated") }}
                  {{ bot.updatedAt | toDate('short') }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-sm-2 align-self-center">
            <button type="submit" class="btn btn-sm btn-primary btn-block mb-2" @click="viewBot(bot._id)">{{ $t('common.view') }}</button>
          </div>
        </div>
        <hr >
      </div>
      <div class="row">
        <div class="col-sm text-center">
          <div class="list__paginator" v-show="pagesCount > 1">
            <a @click="jumpToPage(page - 1)" v-show="page - 1 > 0" :title="$t('common.go_to_previous_page')" class="icon-hover">
              <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" />
            </a>
            <span class="list__paginator-text">{{ $t('common.page') }} {{ page }}</span>
            <a @click="jumpToPage(page + 1)" v-show="page + 1 <= pagesCount" :title="$t('common.go_to_next_page')" class="icon-hover">
              <img :src="require('@/assets/icons/outline-icon-forward-24px.svg')" />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import StarRating from 'vue-star-rating';
import MyProducts from '@/views/MyProducts.vue';

export default {
  name: 'BotsList',
  components: {
    StarRating,
    MyProducts,
  },
  data() {
    return {
      fetching: false,
      bots: [],
      pagesCount: 0,
      resultsCount: 0,
      page: 1,
      status: '',
      sortBy: 'name',
      sortType: 'asc',
    };
  },
  created() {
    this.getData();
  },
  methods: {
    doSearch() {
      this.page = 1;
      this.getData();
    },
    getData() {
      this.fetching = true;
      this.bots = [];
      this.axios.get('/api/bots', {
        params: {
          page: this.page,
          search: this.$parent.$parent.search,
          status: this.status,
          sortBy: this.sortBy,
          sortType: this.sortType,
        },
      })
        .then((results) => {
          this.fetching = false;
          this.pagesCount = results.data.pagesCount;
          this.resultsCount = results.data.resultsCount;
          this.bots = results.data.results;
        })
        .catch((error) => {
          this.fetching = false;
          this.oops = true;
        });
    },
    setStatus(column) {
      this.status = column;
      this.doSearch();
    },
    setSortBy(column) {
      this.sortBy = column;
      this.doSearch();
    },
    toggleSortType() {
      this.sortType = (this.sortType === 'asc' ? 'desc' : 'asc');
      this.doSearch();
    },
    jumpToPage(pageNumber) {
      this.page = pageNumber;
      this.getData();
    },
    viewBot(id) {
      this.$router.push({ name: 'botsView', params: { id } });
    },
  },
};
</script>

<style lang="scss" scoped>


.list {
  margin-top: 10px;
  color: #212529;

  &__empty {
    color: #686b77;
    font-size: 16px;
    text-align: center;
    margin: 5rem 0;
  }

  &__filter {
    text-decoration: none;
    margin-right: 40px;
    color: #686b77;

    &:hover {
      color: #6b4c9f;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    &.active {
      color: #6b4c9f;
      font-weight: bold;
    }
  }

  &__sorting {
    color: #686b77;
    text-align: right;
    font-size: 14px;
    margin-bottom: 3rem;
  }

  &__sort {
    text-decoration: none;
    margin-left: 15px;
    color: #686b77;

    &:hover {
      color: #6b4c9f;
      font-weight: 600;
      text-decoration: none;
      cursor: pointer;
    }

    &.active {
      color: #6b4c9f;
      font-weight: bold;
    }
  }

  &__image {
    width: 104px;
    border-radius: 1rem !important;

    &:hover {
      cursor: pointer;
    }
  }

  &__name {
  color: #212529;
  font-size: 16px;
  font-weight: 500;
  }

  &__description {
    color: #686b77;
    font-size: 16px;
  }

  &__misc {
    margin-top: 10px;
    color: #a3a8b0;
  }

  &__rating {
    float: left;
  }

  &__category {
    height: 20px;
    line-height: 20px;
    vertical-align: text-bottom;
    float: left;
    padding-top: 4px;
    margin-left: 15px;
  }

  &__updated {
    height: 20px;
    line-height: 20px;
    vertical-align: text-bottom;
    float: left;
    padding-top: 4px;
    margin-left: 15px;
  }

  &__paginator {
    margin-top: 10px;

    &-text {
      color: #686b77;
      margin: 0 1em;
    }
  }
}


hr {
  border: none;
  border-top: 1px solid #f6f6f6;
  margin: 24px 0;
}

.circle-text {
  margin-top: 3em;
  margin-bottom: 1em;
}

</style>
