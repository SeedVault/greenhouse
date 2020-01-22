<template>
  <app-page>
    <template v-slot:main>
      <full-centered v-slot:main v-if="loading || oops">
        <loading-checkmark visible="false" :loading="loading" v-if="!oops"></loading-checkmark>
        <oops v-show="oops"></oops>
      </full-centered>

      <div class="row" v-show="!loading && !oops">
        <div class="col-xl-7">
          <simple-box :title="$t('dashboard.balance')">
            <div class="display-1 text-truncate mb-3">
              <icon icon="seed-symbol"
              class="token-symbol" /> {{ $n(balance, 'cryptoCurrency') }}
            </div>
            <balance-chart v-if="!loading" :chart-data="chartBalanceData"
            :options="chartBalanceOptions" :height="200"></balance-chart>
          </simple-box>

          <simple-box :title="$t('dashboard.tutorials')">
            <div class="mb-3">{{ $t('dashboard.tutorials_text') }}</div>
            <div class="d-flex flex-column flex-sm-row">
              <div class="pr-3"><img class="align-self-start img-fluid mb-3"
              src="/images/tutorial-nUdJ9-G9xHwmq.jpg" alt="Tutorial"></div>
              <div class="">
                <a target="_blank" href="https://www.youtube.com/watch?v=nUdJ9-G9xHw&list=PLg58K2Ei6SkEJSkf3ipm1utqGfq_k6-rk">
                <h6 class="mt-0">Greenhouse: Create New Bot with DialogFlow agent
                for Web and Telegram</h6></a>
                <div class="smallest-text text-black-50">In this short tutorial, Gaby walks you
                  through the steps to create a new bot in the Greenhouse marketplace
                  from scratch.</div>
              </div>
            </div>
          </simple-box>

          <simple-box :title="$t('dashboard.tutorials_community')">
            <div class="media">
              <a target="_blank" href="https://discordapp.com/invite/Suv5bFT">
              <img class="align-self-start mr-3"
              src="/images/discord-logo-color.svg"
              alt="Tutorial" style="width: 48px"></a>
              <div class="media-body">
                <h6>{{ $t('dashboard.tutorials_join_discord') }}</h6>
                <a target="_blank" href="https://discordapp.com/invite/Suv5bFT">
                  <h6 class="mt-6">https://discordapp.com/invite/Suv5bFT</h6>
                </a>
              </div>
            </div>

            <hr />

            <div class="media">
              <a target="_blank" href="https://discordapp.com/invite/Suv5bFT">
              <img class="align-self-start mr-3"
              src="/images/telegram-logo.svg"
              alt="Tutorial" style="width: 48px"></a>
              <div class="media-body">
                <h6>{{ $t('dashboard.tutorials_join_telegram_title') }}</h6>
            <p>{{ $t('dashboard.tutorials_join_telegram_text') }}</p>
                <a target="_blank" href="https://t.me/seedtoken">
                  <h6 class="mt-6">https://t.me/seedtoken</h6>
                </a>
              </div>
            </div>
          </simple-box>
        </div>
        <div class="col-xl-5">
          <simple-box :title="$t('dashboard.latest_transactions')">
            <latest-transactions
            :wallet-address="walletAddress"
            :transactions="latestTransactions"></latest-transactions>
          </simple-box>
          <simple-box :title="$t('dashboard.our_discord_channel')">
            <iframe src="https://disweb.dashflo.net/channels/417290225446944768/426348970361487360"
          height="600" width="100%"></iframe>
          </simple-box>
        </div>
      </div>


    </template>
    <router-view/>
  </app-page>
</template>

<script>
import AppPage from 'seed-theme/src/layouts/AppPage.vue';
import BigNumber from 'bignumber.js';
import { reactive, toRefs } from '@vue/composition-api';

export default {
  name: 'Dashboard',
  components: {
    AppPage,
  },
  setup(props, context) {
    const data = reactive({
      loading: false,
      oops: false,
      walletAddress: '',
      balance: '',
      latestTransactions: [],
      chartBalanceOptions: {
        legend: {
          display: false,
        },
      },
      chartBalanceData: {
        labels: [],
        datasets: [
          {
            // label: 'Data One',
            backgroundColor: '#9bdaa4',
            data: [],
          },
        ],
      },
    });

    async function getData() {
      try {
        data.loading = true;
        data.oops = false;
        data.validationErrors = [];
        const response = await context.root.axios.get('/wallet/me/dashboard');
        data.walletAddress = response.data.walletAddress;
        data.balance = response.data.balance;
        data.latestTransactions = response.data.latestTransactions;
        data.chartBalanceData.labels = [];
        data.chartBalanceData.datasets[0].data = [];
        let balanceHistory = new BigNumber(response.data.balance);
        const hist = [balanceHistory];
        for (let i = 0; i < data.latestTransactions.length; i += 1) {
          const amount = new BigNumber(data.latestTransactions[i].amount);
          if (data.latestTransactions[i].sent) {
            balanceHistory = balanceHistory.plus(amount);
          } else {
            balanceHistory = balanceHistory.minus(amount);
          }
          hist.push(balanceHistory);
        }
        for (let i = data.latestTransactions.length - 1; i >= 0; i -= 1) {
          data.chartBalanceData.labels.push(
            context.root.$i18n.d(Date.parse(data.latestTransactions[i].date), 'short'),
          );
          data.chartBalanceData.datasets[0].data.push(hist[i]);
        }
        data.loading = false;
      } catch (error) {
        data.loading = false;
        data.oops = true;
      }
    }

    getData();

    return {
      ...toRefs(data), getData,
    };
  },
};

</script>

<style lang="scss" scoped>

.token-symbol {
  height: 0.88em;
  top: -2px;
  position: relative;
}

.media {
  color: #686b77;
  font-size: 12px;
}

hr {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px dotted #dedfe0;
}

</style>
