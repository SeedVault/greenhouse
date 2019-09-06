<template>
  <div class="not-found">
    <h1>Error {{ httpError }}</h1>
    <h2>{{ errorMessage }}</h2>
  </div>
</template>

<script>
export default {
  props: {
    httpError: {
      type: String,
      default: '500',
    },
  },
  computed: {
    errorMessage() {
      switch (parseInt(this.httpError, 10)) {
        case 403:
          return 'Forbidden';
        case 404:
          return 'Not found';
        case 500:
          return 'Server error';
        default:
          return 'Opps! Something went wrong!';
      }
    },
  },
};
</script>
