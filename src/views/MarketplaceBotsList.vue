<template>
  <app-layout>
    <div class="row">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body top-box">
            <form>
              <div class="form-row">
                <div class="col-12 col-sm-4 mb-2">
                  <div class="nav menu">
                  <a class="nav-link" @click="setSubscription('')"
                  v-bind:class="{'list__filter': true, 'active': subscription === '' }"
                  href="#">{{ $t('domain.bot_statuses.all') }}</a>
                  <a class="nav-link" @click="setSubscription('mine')"
                  v-bind:class="{'list__filter': true, 'active': subscription === 'mine' }"
                  href="#">{{ $t('bots.my_subscriptions') }}</a>
                  </div>
                </div>
                <div class="col-12 col-sm-4 mb-2">
                  <div class="form-group">
                    <select id="category" v-model="category" @change="changeCategory"
                    class="form-control medium-size">
                      <option v-for="option in botCategories" :value="option.value"
                      :key="option.value">
                        {{ option.text }}
                      </option>
                    </select>
                  </div>
                </div>
                <div class="col-12 col-sm-4 mb-2">
                  <div class="input-group">
                    <input type="text" v-model="search" class="form-control medium-size"
                    :placeholder="$t('common.search')"
                    v-on:keydown.enter.prevent="doSearch" @blur="searchBlur" @focus="searchFocus">
                    <div class="input-group-append">
                      <span v-bind:class="{'input-group-text': true,
                      'search-button': !focusOnSearch, 'search-button-focused': focusOnSearch }"
                      @click.prevent="doSearch">
                        <template v-if="focusOnSearch">
                          <img :src="require('@/assets/icons/outline-search-white-24px.svg')" />
                        </template>
                        <template v-else>
                          <img :src="require('@/assets/icons/outline-search-24px.svg')" />
                        </template>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-6">
                  <!-- empty left -->
                </div>
                <div class="col-6 list__sorting">
                  <div v-show="!fetching & bots.length > 0">
                    {{ $t('common.sort_by') }}:
                    <a @click="setSortBy('name')"
                    v-bind:class="{'list__sort': true, 'active': sortBy === 'name' }"
                    href="#">{{ $t('domain.bot.name') }}</a>
                    <a @click="setSortBy('updatedAt')"
                    v-bind:class="{'list__sort': true, 'active': sortBy === 'updatedAt' }"
                    href="#">{{ $t('common.date') }}</a>
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
              </div>
            </form>
          </div>
          <div class="shadow-ruler">
            <div class="card-body">

              <div>
                <div class="fetching text-center" v-show="fetching">
                  <div v-bind:class="[{ 'load-complete': !fetching }, 'circle-loader circle-text']">
                  </div>
                  <div v-if="fetching">
                    {{ $t('common.please_wait') }}
                  </div>
                </div>

                <div class="list" v-show="!fetching">
                  <div class="list__empty" v-show="!fetching & bots.length === 0">
                    {{ $t('bots.there_are_no_bots') }}
                  </div>
                  <div v-for="(bot, index) in bots" :key="index">
                    <div class="row">
                      <div class="col-sm">
                        <div class="media">
                          <img :src="bot.pictureUrl" class="list__image mr-4"
                          @click="viewBot(bot._id)">
                          <div class="media-body list-body mb-2">
                            <h5 class="list__name mt-0">{{ bot.name }}</h5>
                            <div class="list__description">{{ bot.description }}</div>
                            <div class="list__misc clearfix">
                              <div class="list__rating">
                                <star-rating :rating="3.5" :increment="0.5"
                                :star-size="18" :show-rating="false" :inline="true"
                                :read-only="true"></star-rating>
                              </div>
                              <div class="list__category">
                                {{ $t("common.by") }} {{ bot.username }}</div>
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
                        <button type="submit" class="btn btn-sm btn-primary btn-block mb-2"
                        @click="viewBot(bot._id)">{{ $t('common.view') }}</button>
                      </div>
                    </div>
                    <hr >
                  </div>
                  <div class="row">
                    <div class="col-sm text-center">
                      <div class="list__paginator" v-show="pagesCount > 1">
                        <a @click="jumpToPage(page - 1)" v-show="page - 1 > 0"
                          :title="$t('common.go_to_previous_page')" class="icon-hover">
                          <img :src="require('@/assets/icons/outline-icon-back-24px.svg')" />
                        </a>
                        <span class="list__paginator-text">{{ $t('common.page') }} {{ page }}</span>
                        <a @click="jumpToPage(page + 1)"
                        v-show="page + 1 <= pagesCount" :title="$t('common.go_to_next_page')"
                        class="icon-hover">
                          <img :src="require('@/assets/icons/outline-icon-forward-24px.svg')" />
                        </a>
                      </div>
                    </div>
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
import StarRating from 'vue-star-rating';
import { mapGetters } from 'vuex';

export default {
  name: 'BotsList',
  components: {
    AppLayout,
    StarRating,
  },
  data() {
    return {
      category: '',
      search: '',
      focusOnSearch: false,
      fetching: false,
      bots: [],
      pagesCount: 0,
      resultsCount: 0,
      page: 1,
      subscription: '',
      sortBy: 'name',
      sortType: 'asc',
      validationErrors: [],
    };
  },
  created() {
    this.getData();
  },
  methods: {
    searchFocus() {
      this.focusOnSearch = true;
    },
    searchBlur() {
      this.focusOnSearch = false;
    },
    changeCategory() {
      this.doSearch();
    },
    doSearch() {
      this.page = 1;
      this.getData();
    },
    getData() {
      this.fetching = true;
      this.bots = [];
      this.axios.get('/api/marketplace/bots', {
        params: {
          page: this.page,
          search: this.search,
          subscription: this.subscription,
          sortBy: this.sortBy,
          sortType: this.sortType,
          category: this.category,
        },
      })
        .then((results) => {
          this.fetching = false;
          this.pagesCount = results.data.pagesCount;
          this.resultsCount = results.data.resultsCount;
          this.bots = results.data.results;
        })
        .catch(() => { // (error)
          this.fetching = false;
          this.oops = true;
        });
    },
    setSubscription(column) {
      this.subscription = column;
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
      this.$router.push({ name: 'marketplaceBotsView', params: { id } });
    },
  },
  computed: {
    ...mapGetters(['allBotCategories']),
    botCategories() {
      const botCategoryList = [];
      botCategoryList.push({
        value: '',
        text: this.$i18n.t('domain.bot.all_categories'),
      });
      for (let i = 0; i < this.allBotCategories.length; i += 1) {
        botCategoryList.push({
          value: this.allBotCategories[i],
          text: this.$i18n.t(`domain.bot_categories.${this.allBotCategories[i]}`),
        });
      }
      return botCategoryList;
    },
  },
};
</script>

<style lang="scss" scoped>

.top-box {
  padding: 1.75rem 2rem 1.25rem;
}

.shadow-ruler {
  border: 0;
  -webkit-box-shadow: 0px -4px 5px rgba(224, 229, 238, 0.4);
  box-shadow: 0px -4px 5px rgba(224, 229, 238, 0.4);
  margin-bottom: 32px;
}

.medium-size {
  padding: 0.1rem 1rem;
  height: 48px;
}

.search-button {
  padding: 0rem 0.75rem;
  background-color: #fff;

  &:hover {
    cursor: pointer;
  }
}

.search-button-focused {
  padding: 0rem 0.75rem;
  color: #fff;
  background-color: #6b4c9f ;
  border-color: #6b4c9f;

  &:hover {
    cursor: pointer;
  }
}

.menu {
  a {
    font-size: 16px;
    padding: 13px 0px 13px 0px;
    color: #686b77;
    img {
      padding-right: 2px;
      width: 28px;
      text-align: right;
      top: -3px;
      position: relative;
    }

    &.active {
      /* background: rgba(107,76,159,.15); */
      border-radius: 8px;
      color: #6b4c9f;
      font-weight: 500;
      img {
        filter: invert(38%) sepia(13%) saturate(2389%) hue-rotate(221deg)
        brightness(75%) contrast(92%);
      }
    }

    &:hover {
      color: #6b4c9f;
      font-weight: 500;
      img {
        filter: invert(38%) sepia(13%) saturate(2389%) hue-rotate(221deg)
        brightness(75%) contrast(92%);
      }
    }
  }
}

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
    margin-top: 1rem;
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
