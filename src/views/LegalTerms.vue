<template>
  <public-layout>
    <div id="legal-terms">
      <div class="row">
        <div class="col-12 col-md-5 col-lg-3">
          <legal-submenu />
        </div>
        <div class="col-12 col-md-7 col-lg-9 legal-text">
          <router-view/>
          <h1>{{ $t('legal.tos.terms_of_service') }}</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed ultrices ex elit, eu fermentum odio dignissim nec. Praesent
            dictum nulla velit, a bibendum nisi euismod ac. Aliquam erat
            volutpat. Nullam luctus molestie ex nec efficitur. Donec consequat
            lorem a imperdiet euismod. Praesent at augue sed nulla bibendum
            rutrum non vel justo. Curabitur consectetur turpis libero, ac
            varius neque tempor non.</p>
          <p>Sed efficitur nibh venenatis ultrices rutrum. Etiam vitae semper
            ex, vitae auctor nibh. Aliquam pellentesque dolor ante, et viverra
            arcu vulputate convallis. Vestibulum ante ipsum primis in faucibus
            orci luctus et ultrices posuere cubilia Curae; In aliquet interdum
            libero, consectetur semper nunc mollis ut. Morbi tempor nisl sit
            amet interdum posuere. Suspendisse eget ornare purus.
            Nulla facilisi.</p>
          <p>Aenean sodales aliquam ornare. Vivamus nunc mi, iaculis in metus
            sed, interdum laoreet metus. Nullam eu elementum odio. Vivamus ut
            eros augue. Duis a arcu a neque ullamcorper scelerisque vel id
            augue. Donec bibendum lorem in nunc eleifend aliquet. Phasellus
            enim sem, luctus fermentum scelerisque nec, luctus at ipsum.
            Vestibulum ac lorem in diam commodo aliquam et a enim. Cras erat
            risus, laoreet nec malesuada in, consequat sit amet arcu. Sed
            efficitur porta augue, non rutrum erat varius nec. Fusce sodales,
            dolor ut iaculis eleifend, leo lacus pharetra enim, nec
            sollicitudin turpis turpis et ante. Aenean ultricies odio ac leo
            convallis, ac sodales ex tincidunt. Duis pellentesque semper orci,
            sit amet egestas tortor volutpat at. Donec porta, libero a
            tincidunt dignissim, tortor nunc tempus elit, at porttitor elit
            ante quis odio. Ut condimentum enim vitae imperdiet blandit.
            Nullam at sagittis tellus, in dictum nibh.</p>
          <p>Pellentesque scelerisque efficitur mi at pulvinar. Ut laoreet
            vitae nisi quis placerat. Phasellus a ex a augue dapibus commodo.
            Suspendisse potenti. Proin a consequat massa. Vivamus convallis
            dapibus magna. Sed enim mi, maximus sed facilisis at, tempor ac
            mauris. Mauris urna nisi, commodo a sodales nec, ornare nec augue.
             Aliquam ultricies odio finibus porta tincidunt. In dictum tempus
             ullamcorper. Quisque vitae rutrum eros. Donec mattis convallis
             erat auctor finibus. Mauris consequat ligula ligula,
             quis consequat lacus semper id.</p>
        </div>
      </div>
    </div>
  </public-layout>
</template>

<script>
import PublicLayout from '../layouts/PublicLayout.vue';
import LegalSubmenu from '../components/LegalSubmenu.vue';

export default {
  name: 'LegalTerms',
  components: {
    PublicLayout,
    LegalSubmenu,
  },
};
</script>

<style lang="scss" scoped>

.legal-text {
  border-left: 1px solid rgba(0, 0, 0, 0.125);
  padding-left: 40px;
}

h1 {
  font-size: 1.75rem;
  color: #323743;
  margin-bottom: 2rem;
}

</style>
