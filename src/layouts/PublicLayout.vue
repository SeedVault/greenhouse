<template>
  <div class="main-container">

    <div class="container">
      <b-navbar toggleable="lg">
        <router-link :class="navbar-brand" :to="{ name: 'home'}" style="height: 30px;">
          <!-- <img class="navbar-brand-img" src="/images/application_logo_greenhouse.svg"
          alt="SEED Greenhouse" /> -->
          <div class="media" style="margin-top: 0px;margin-bottom: 40px;">
            <img class="navbar-brand-img align-self-start mr-3" :src="logoImage" style="margin-left:5px;width:30px;height:30px" />
            <div class="media-body">
              <!-- <img class="" src="/images/logo_separator.png" style="floating:right;width: 1px; height:30px;margin-right: 5px;"/> -->
              <img class="" :src="logoText" :style="logoTextStyle" />
            </div>
          </div>
        </router-link>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav v-if="user">
          <b-navbar-nav class="ml-auto">
            <!-- <b-nav-item href="#">Link</b-nav-item>
            <b-nav-item href="#">Link</b-nav-item> -->
            <b-nav-item-dropdown right>
              <template slot="button-content"><em>{{ user.username || '' }}</em></template>
              <!-- <b-dropdown-item href="#">Profile</b-dropdown-item> -->
              <b-dropdown-item href="/auth/logout">Sign Out</b-dropdown-item>
            </b-nav-item-dropdown>
          </b-navbar-nav>
        </b-collapse>
      </b-navbar>
    </div>

    <div class="container">
      <slot/>
    </div>

    <footer>
      <div class="container">
        <div class="row">
          <div class="col-12 col-md-5 col-lg-6 ">
            <locale-changer />
          </div>
          <div class="col-12 col-md-7 col-lg-6 legal">
            <router-link :to="{ name: 'legal-privacy'}">{{ $t('common.privacy') }}</router-link>
            <router-link :to="{ name: 'legal-terms'}">{{ $t('common.terms') }}</router-link>
          </div>
        </div>
      </div>
    </footer>

  </div>
</template>

<script>
export default {
  data() {
    return {
      navbar: '',
      brand: '',
    };
  },
  computed: {
    user() {
      return this.$store.getters.user;
    },
    logoImage() {
      return this.$store.getters.logoImage;
    },
    logoText() {
      return this.$store.getters.logoText;
    },
    logoTextStyle() {
      return `padding-left:5px;height:30px;width:${this.$store.getters.logoTextWidth};`;
    },
  },
};
</script>
<style lang="scss" scoped>

.navbar {
  margin-top: 10px;
  margin-bottom: 40px;
}

.legal {
  text-align: right;
  a {
    font-size: 0.75rem;
    color: #495057;
    line-height: 1.75rem;

    &:last-child {
      margin-left: 20px;
    }
  }

  @media (max-width: 576px) {
    text-align: left;
  }
}
</style>
