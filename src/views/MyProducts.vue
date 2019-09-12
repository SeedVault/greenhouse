<template>
  <app-layout>
    <div class="row">
      <div class="col-sm">
        <div class="card box">
          <div class="card-body top-box">
            <form>
              <div class="form-row">
                <div class="col-12 col-sm-6 mb-2">
                  <ul class="nav menu">
                    <li class="nav-item">
                      <router-link class="nav-link" :to="{ name: 'botsList' }">
                        <img :src="require('@/assets/icons/outline-bot-icon-24.svg')" />
                        {{ $t('products.bots') }}
                      </router-link>
                    </li>
                    <li class="nav-item">
                      <router-link class="nav-link" :to="{ name: 'componentsList' }">
                        <img :src="require('@/assets/icons/outline-component-24px.svg')" />
                        {{ $t('products.components') }}
                      </router-link>
                    </li>
                  </ul>
                </div>
                <div class="col-12 col-sm-2 mb-2">
                  <button @click.prevent="addNew" class="btn btn-primary medium-size">+
                    {{ $t('common.add_new') }}</button>
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
            </form>
          </div>
          <div class="shadow-ruler">
            <div class="card-body">
              <router-view ref="childList"></router-view>
            </div>
          </div>
        </div>
      </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';

export default {
  name: 'MyProducts',
  components: {
    AppLayout,
  },
  data() {
    return {
      search: '',
      focusOnSearch: false,
    };
  },
  methods: {
    searchFocus() {
      this.focusOnSearch = true;
    },
    searchBlur() {
      this.focusOnSearch = false;
    },
    doSearch() {
      this.$refs.childList.doSearch();
    },
    addNew() {
      switch (this.$route.name) {
        case 'componentsList':
          this.$router.push({ name: 'componentsForm' });
          break;
        case 'botsList':
          this.$router.push({ name: 'botsForm' });
          break;
        default:
          // do nothing
      }
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
    padding: 13px 30px 13px 0px;
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
</style>
