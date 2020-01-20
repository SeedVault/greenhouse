<template>
  <div>
    <little-centered v-slot:main v-if="loading || oops">
      <loading-checkmark visible="false" :loading="loading" v-if="!oops">
        <template v-slot:messages>
          <div v-if="loading">
            {{ $t('common.please_wait') }}
          </div>
        </template>
      </loading-checkmark>
      <oops v-show="oops"></oops>
    </little-centered>


    <div v-if="!loading && !oops">
      <div class="row mt-2 mb-5">
        <div class="col-12 col-sm-4 mb-2">
          <div class="d-flex flex-column flex-lg-row mb-3">
            <button v-show="canWrite()" @click.prevent="addNew"
              class="btn btn-sm btn-primary btn-add font-weight-bold
              mr-sm-3 mb-2 custom-select-sm">+
                {{ $t('common.add_new') }}</button>
            <input-search-small v-model="search" id="search"
              :placeholder="$t('common.search')"
              :validationErrors="validationErrors"
              @do-search="doSearch"
              ></input-search-small>
              <div class="mb-2"></div>

            <!-- <a @click.prevent="setStatus('')"
              v-bind:class="{'paginated-list__heading': true, 'active': status === '',
              'mr-5': true }"
              href="#">{{ $t('domain.component_statuses.all') }}</a>
            <a @click.prevent="setStatus('enabled')"
              v-bind:class="{'paginated-list__heading': true, 'active': status === 'enabled',
              'mr-5': true }"
              href="#">{{ $t('domain.component_statuses.enabled') }}</a>
            <a @click.prevent="setStatus('disabled')"
              v-bind:class="{'paginated-list__heading': true, 'active': status === 'disabled' }"
              href="#">{{ $t('domain.component_statuses.disabled') }}</a> -->
          </div>
          <!-- <div class="d-block d-sm-none">
            <hr />
          </div> -->
        </div>
        <div class="col-12 col-sm-8 mb-2">
          <div class="d-flex flex-column flex-xl-row smallest-text justify-content-end">
              <div class="d-flex flex-column flex-sm-row justify-content-start">
                <label class="my-1 mr-2 text-black-50 label-width text-sm-right" for="filters">
                  {{ $t('common.show') }}
                </label>
                <input-select-small v-show="canWrite()"
                v-model="status"
                :options="componentStatuses()" id="status"
                v-on:change="doSearch()"
                class=" mr-sm-2 mb-2"></input-select-small>
                <input-select-small v-model="category"
                :options="componentCategories()" id="category" class="mb-2"
                v-on:change="doSearch()"></input-select-small>
              </div>

              <div class="d-flex flex-column flex-sm-row justify-content-start">
                <label class="ml-md-2 my-1 mr-2 text-black-50 label-width text-sm-right"
                for="sort">
                  {{ $t('common.sort_by') }}
                </label>
                <div class="d-flex  ">
                  <!-- <select class="custom-select custom-select-sm
                  thin-borders cursor-pointer mr-2
                  ">
                    <option selected>{{ $t('domain.component.name') }}</option>
                    <option value="1">{{ $t('common.date') }}</option>
                  </select> -->
                  <input-select-small v-model="sortBy"
                    :options="sortOptions()" id="sortBy" class="mr-2"
                    v-on:change="doSearch()"></input-select-small>
                  <a @click.prevent="toggleSortType()" class="paginated-list__heading icon-hover">
                    <template v-if="sortType === 'desc'">
                      <icon icon="sort-desc" />
                    </template>
                    <template v-else>
                      <icon icon="sort-asc" />
                    </template>
                  </a>
                </div>
              </div>

            <!-- <a @click.prevent="setSortBy('name')"
            v-bind:class="{'paginated-list__heading': true, 'active': sortBy === 'name',
            'mr-3': true }"
            href="#">{{ $t('domain.component.name') }}</a>
            <a @click.prevent="setSortBy('updatedAt')"
            v-bind:class="{'paginated-list__heading': true, 'active': sortBy === 'updatedAt',
            'mr-3': true }"
            href="#">{{ $t('common.date') }}</a> -->

            <!-- <div class="d-block d-sm-none">
              <hr />
            </div> -->
          </div>
        </div>
      </div>
      <template v-if="!loading & components.length === 0">
        <div class="mt-5 mb-5 text-black-50 text-center medium-text">
          <template v-if="servicesOnly">
            {{ $t('services.there_are_no_services') }}
          </template>
          <template v-else>
            {{ $t('components.there_are_no_components') }}
          </template>
        </div>
      </template>
      <template v-else>
        <div v-for="(component, index) in components" :key="index">
          <div class="d-flex flex-column flex-md-row mt-3 paginated-list__border-bottom">
            <div class="pr-sm-3">
              <img class="paginated-list__image rounded-lg align-self-start mb-3 cursor-pointer"
              :src="component.pictureUrl" @click.prevent="doAction(component._id)">
            </div>
            <div class="flex-fill pr-sm-3">
              <h2 class="h5 mt-0">{{ component.name }}</h2>
              <div class="medium-text text-black-50 mb-3">
                {{ component.description }}
              </div>
              <div class="d-flex flex-column flex-lg-row mb-sm-3 smallest-text
                paginated-list__metadata">
                <div class="mr-sm-3 mb-2">
                  <rating instance-type="component" :instance-id="component.id"
                  :average-rating="component.averageRating" :reviews-count="component.reviewsCount">
                  </rating>
                </div>
                <div class="pr-lg-2 mb-2 paginated-list__horizontal-separator">
                  {{ $t("common.by") }} <a href="#"
                  @click.prevent="profile(component.user.username)">
                    {{ component.user.username }}</a>
                </div>
                <div class="ml-lg-2 pr-sm-2 mb-2 paginated-list__horizontal-separator">
                  <icon icon="tag" class="paginated-list__icon-tag" />
                  {{ $t(`domain.component_categories.${component.category}`) }}
                </div>
                <div class="ml-lg-2 mb-2">
                  <icon icon="timer" class="paginated-list__icon-timer" />
                  {{ $t("components.updated") }}
                  {{ humanDate(component.updatedAt) }}
                  <!-- {{ $d(Date.parse(component.updatedAt), 'short') }} -->
                </div>
              </div>
            </div>
            <div class="d-flex flex-column justify-content-start">
              <a href="#" class="btn btn-md btn-primary btn-block font-weight-bold px-5"
              @click.prevent="doAction(component._id)">
                <template v-if="screen === 'select'">
                  {{ $t('common.select') }}
                </template>
                <template v-else>
                  {{ $t('common.view') }}
                </template>
              </a>
            </div>
          </div>
        </div>
        <template v-if="pagesCount > 1">
          <div class="text-center mt-3">
            <a @click="jumpToPage(page - 1)" v-show="page - 1 > 0"
              :title="$t('common.go_to_previous_page')" class="icon-hover">
              <icon icon="chevron-left" />
            </a>
            <span class="list__paginator-text">{{ $t('common.page') }} {{ page }}</span>
            <a @click="jumpToPage(page + 1)" v-show="page + 1 <= pagesCount"
              :title="$t('common.go_to_next_page')" class="icon-hover">
              <icon icon="chevron-right" />
            </a>
          </div>
        </template>
      </template>
    </div>

  </div>
</template>

<script>
import { reactive, toRefs } from '@vue/composition-api';
import Rating from '@/components/Rating.vue';

export default {
  name: 'ComponentList',
  components: {
    Rating,
  },
  props: ['servicesOnly', 'componentType', 'screen'],
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      components: [],
      pagesCount: 0,
      resultsCount: 0,
      page: 1,
      status: '',
      sortBy: 'name',
      sortType: 'asc',
      search: '',
      category: '',
      validationErrors: [],
    });

    function componentStatuses() {
      const componentStatusList = [];
      componentStatusList.push({
        value: '',
        text: context.root.$i18n.t('domain.component_statuses.all'),
      });
      const { allComponentStatuses } = context.root.$store.getters;
      for (let i = 0; i < allComponentStatuses.length; i += 1) {
        componentStatusList.push({
          value: allComponentStatuses[i],
          text: context.root.$i18n.t(`domain.component_statuses.${allComponentStatuses[i]}`),
        });
      }
      return componentStatusList;
    }

    function componentCategories() {
      const componentCategoryList = [];
      componentCategoryList.push({
        value: '',
        text: context.root.$i18n.t('domain.component.all_categories'),
      });
      const { allComponentCategories } = context.root.$store.getters;
      for (let i = 0; i < allComponentCategories.length; i += 1) {
        componentCategoryList.push({
          value: allComponentCategories[i],
          text: context.root.$i18n.t(`domain.component_categories.${allComponentCategories[i]}`),
        });
      }
      return componentCategoryList;
    }


    function sortOptions() {
      const sortOptionsList = [];
      sortOptionsList.push({
        value: 'name',
        text: context.root.$i18n.t('domain.component.name'),
      });
      sortOptionsList.push({
        value: 'averageRating',
        text: context.root.$i18n.t('domain.bot.average_rating'),
      });
      sortOptionsList.push({
        value: 'updatedAt',
        text: context.root.$i18n.t('common.date'),
      });
      return sortOptionsList;
    }


    async function getData() {
      try {
        let prefix = 'components';
        if (props.servicesOnly) {
          prefix = 'services';
        }
        let url = `/${prefix}`;
        if (props.screen === 'users') {
          url = `/${prefix}/user/${encodeURI(context.root.$route.params.username)}`;
        }
        if (props.screen === 'select') {
          url = `/components/type/${encodeURI(props.componentType)}`;
        }
        data.loading = true;
        data.oops = false;
        data.components = [];
        const response = await context.root.axios.get(url, {
          params: {
            page: data.page,
            category: data.category,
            search: data.search,
            status: data.status,
            sortBy: data.sortBy,
            sortType: data.sortType,
          },
        });
        data.pagesCount = response.data.pagesCount;
        data.resultsCount = response.data.resultsCount;
        data.components = response.data.results;
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    function doSearch() {
      data.page = 1;
      getData();
    }

    function toggleSortType() {
      data.sortType = (data.sortType === 'asc' ? 'desc' : 'asc');
      doSearch();
    }

    function jumpToPage(pageNumber) {
      data.page = pageNumber;
      getData();
    }

    function addNew() {
      let routeName = 'usersComponentsForm';
      if (props.servicesOnly) {
        routeName = 'usersServicesForm';
      }
      context.root.$router.push({
        name: routeName,
        params: {
          username: context.root.$route.params.username,
        },
      });
      /* switch (context.root.$route.name) {
        case 'usersComponents':
          context.root.$router.push({ name: 'componentsForm',
          params: { username: data.username } });
          break;
        case 'usersBots':
          context.root.$router.push({ name: 'botsForm', params: { username: data.username } });
          break;
        default:
          // do nothing
      } */
    }

    function doAction(id) {
      if (props.screen === 'select') {
        context.emit('component-selected', {
          id,
        });
      } else {
        let s = 'Components';
        if (props.servicesOnly) {
          s = 'Services';
        }
        const routeName = `${props.screen}${s}View`;
        context.root.$router.push({ name: routeName, params: { id } });
      }
    }

    function profile(username) {
      if (props.screen === 'select') {
        return;
      }
      if (props.screen === 'users' && context.root.$route.params.username === username) {
        return;
      }
      let routeName = 'usersComponents';
      if (props.servicesOnly) {
        routeName = 'usersServices';
      }
      context.root.$router.push({ name: routeName, params: { username } });
    }

    function canWrite() {
      return props.screen === 'users'
      && context.root.$route.params.username === context.root.$store.getters.user.username;
    }


    getData();

    return {
      ...toRefs(data),
      componentStatuses,
      componentCategories,
      sortOptions,
      getData,
      doSearch,
      /* setStatus,
      setSortBy, */
      toggleSortType,
      jumpToPage,
      doAction,
      profile,
      addNew,
      canWrite,
    };
  },
};
</script>

<style lang="scss" scoped>
.label-width {
  min-width: 60px;
}
</style>
