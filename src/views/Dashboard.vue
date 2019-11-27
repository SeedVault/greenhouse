<template>
  <app-layout>
    <loading-circle loading="loading" v-show="loading"></loading-circle>
    <oops v-show="oops"></oops>

    <div class="row" v-show="!loading && !oops">
      <div class="col-lg-7">
        <div class="card box">
          <div class="card-body">
            <h4 class="card-title">{{ $t('dashboard.balance') }}</h4>
            <div class="balance">
              <img src="@/assets/images/seed-icon@2x.svg" />
              {{ balance | toCryptoCurrency() }}
            </div>
            <balance-chart v-if="!loading" :chartdata="chartBalanceData"
            :options="chartBalanceOptions" :height="200"></balance-chart>
          </div>
        </div>

        <div class="card box">
          <div class="card-body">
            <h4 class="card-title">{{ $t('dashboard.tutorials') }}</h4>
        <div>{{ $t('dashboard.tutorials_text') }}</div>
        <br />
        <div class="media">
          <a target="_blank" href="https://www.youtube.com/watch?v=nUdJ9-G9xHw&list=PLg58K2Ei6SkEJSkf3ipm1utqGfq_k6-rk">
          <img class="align-self-start mr-3 img-fluid"
          src="@/assets/images/tutorial-nUdJ9-G9xHwmq.jpg"
          alt="Tutorial" style="width: 120px"></a>
          <div class="media-body">
            <a target="_blank" href="https://www.youtube.com/watch?v=nUdJ9-G9xHw&list=PLg58K2Ei6SkEJSkf3ipm1utqGfq_k6-rk">
            <h6 class="mt-0">Greenhouse: Create New Bot with DialogFlow agent
            for Web and Telegram</h6></a>
            In this short tutorial, Gaby walks you through the steps to create
            a new bot in the Greenhouse marketplace from scratch.
          </div>
        </div>

          </div>
        </div>
        <div class="card box">
          <div class="card-body">

            <h4 class="card-title">{{ $t('dashboard.tutorials_community') }}</h4>

            <br />

            <div class="media">
              <a target="_blank" href="https://discordapp.com/invite/Suv5bFT">
              <img class="align-self-start mr-3"
              src="@/assets/images/discord-logo-color.svg"
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
              src="@/assets/images/telegram-logo.svg"
              alt="Tutorial" style="width: 48px"></a>
              <div class="media-body">
                <h6>{{ $t('dashboard.tutorials_join_telegram_title') }}</h6>
            <p>{{ $t('dashboard.tutorials_join_telegram_text') }}</p>
                <a target="_blank" href="https://t.me/seedtoken">
                  <h6 class="mt-6">https://t.me/seedtoken</h6>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card box">
          <div class="card-body">
            <h4 class="card-title" style="margin-bottom: 30px">
              {{ $t('dashboard.latest_transactions') }}</h4>
            <p class="no-transactions" v-if="latestTransactions.length === 0">
              {{ $t('dashboard.there_are_no_transactions') }}
            </p>
            <table class="table table-responsive-xs transactions__table"
            v-if="latestTransactions.length > 0">
              <tbody>
                <tr v-for="(transaction, index) in latestTransactions" :key="index">
                  <td>
                    <div class="transactions__date">{{ transaction.date | toDate('short') }}</div>
                    <div class="transactions__user">{{ transaction.user !== ''?
                      transaction.user: $t('dashboard.unknown') }}</div>
                  </td>
                  <td>{{ (transaction.sent? $t('dashboard.withdraw'):
                    $t('dashboard.deposit')) }}</td>
                  <template v-if="transaction.sent">
                    <td class="v-if transactions__amount-withdraw">
                      <img src="@/assets/icons/ArrowOut@2x.svg" />
                      {{ transaction.amount | toCryptoCurrency }} SEED
                    </td>
                  </template>
                  <template v-else>
                    <td class="transactions__amount-deposit">
                      <img src="@/assets/icons/ArrowIn@2x.svg" />
                      {{ transaction.amount | toCryptoCurrency }} SEED
                    </td>
                  </template>
                </tr>
              </tbody>
            </table>
            <a class="mt-4" style="font-size: 12px" :href="getExplorerUrl"
            target="_blank">{{ $t('dashboard.view_all_transactions') }}</a>
          </div>
        </div>

        <div class="card box">
          <div class="card-body">
            <h4 class="card-title" style="margin-bottom: 30px">
              {{ $t('dashboard.our_discord_channel') }}</h4>
            <iframe src="https://disweb.dashflo.net/channels/417290225446944768/426348970361487360"
          height="600" width="100%"></iframe>
          </div>
        </div>
    </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';
import BigNumber from 'bignumber.js';
import BalanceChart from '../components/BalanceChart.vue';

export default {
  name: 'Dashboard',
  components: {
    AppLayout,
    BalanceChart,
  },
  data() {
    return {
      loading: false,
      oops: false,
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
    };
  },
  created() {
    this.getData();
  },
  computed: {
    getExplorerUrl() {
      return process.env.VUE_APP_PARITY_URL_EXPLORER;
    },
  },
  methods: {
    getData() {
      this.loading = true;
      this.axios.get('/api/dashboard')
        .then((result) => {
          this.loading = false;
          this.balance = result.data.balance;
          this.latestTransactions = result.data.latestTransactions;
          this.chartBalanceData.labels = [];
          this.chartBalanceData.datasets[0].data = [];
          let balanceHistory = new BigNumber(result.data.balance);
          const hist = [balanceHistory];
          for (let i = 0; i < this.latestTransactions.length; i += 1) {
            // console.log(i, this.latestTransactions[i].amount);
            const amount = new BigNumber(this.latestTransactions[i].amount);
            if (this.latestTransactions[i].sent) {
              balanceHistory = balanceHistory.plus(amount);
            } else {
              balanceHistory = balanceHistory.minus(amount);
            }
            hist.push(balanceHistory);
          }
          for (let i = this.latestTransactions.length - 1; i >= 0; i -= 1) {
            this.chartBalanceData.labels.push(this.$options.filters.toDate(this.latestTransactions[i].date, 'short'));
            this.chartBalanceData.datasets[0].data.push(hist[i]);
          }
        })
        .catch(() => {
          this.loading = false;
          this.oops = true;
        });
    },
  },
};
</script>

<style lang="scss" scoped>

.balance {
  font-size: 50px;
  font-weight: 800;
  display: flex;
  align-items: center;
  margin-bottom: 30px;

  img {
    margin-right: 20px;
  }
}

.no-transactions {
  color: #999;
}

.transactions {
    &__table {
      margin-top: 20px;

      tbody tr:nth-of-type(2n) {
        background-color: #f7f8f9;
      }

      td {
        border-top: 0;
        vertical-align: middle;
        font-weight: 500;

        .right {
          text-align: right;
        }
      }
    }

    &__user {
      color: #686b77;
      font-weight: normal;
    }

    &__amount {
      text-align: right;

      img {
        margin-right: 10px;
      }

      &-withdraw {
        color: #f5296a;
      }

      &-deposit {
        color: #39b54a;
      }
    }
  }

// h6 { color: #212529 }

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
