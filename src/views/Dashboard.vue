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
            <balance-chart v-if="!loading" :chartdata="chartBalanceData" :options="chartBalanceOptions" :height="200"></balance-chart>
          </div>
        </div>
      </div>

      <div class="col-lg-5">
        <div class="card box">
          <div class="card-body">
            <h4 class="card-title" style="margin-bottom: 30px">{{ $t('dashboard.latest_transactions') }}</h4>
            <p class="no-transactions" v-if="latestTransactions.length === 0">
              {{ $t('dashboard.there_are_no_transactions') }}
            </p>
            <table class="table table-responsive-xs transactions__table" v-if="latestTransactions.length > 0">
              <tbody>
                <tr v-for="(transaction, index) in latestTransactions" :key="index">
                  <td>
                    <div class="transactions__date">{{ transaction.date | toDate('short') }}</div>
                    <div class="transactions__user">{{ transaction.user !== ''? transaction.user: $t('dashboard.unknown') }}</div>
                  </td>
                  <td>{{ (transaction.sent? $t('dashboard.withdraw'): $t('dashboard.deposit')) }}</td>
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
          </div>
        </div>
    </div>
    </div>
  </app-layout>
</template>

<script>
import AppLayout from 'seed-theme/src/layouts/AppLayout.vue';
import BalanceChart from '../components/BalanceChart.vue';
import BigNumber from 'bignumber.js';
import { Line } from 'vue-chartjs';

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
            data: []
          }
        ]
      },
    };
  },
  created() {
    this.getData()
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
          let hist = [balanceHistory];
          for (let i = 0; i < this.latestTransactions.length; i++) {
            // console.log(i, this.latestTransactions[i].amount);
            let amount = new BigNumber(this.latestTransactions[i].amount);
            if (this.latestTransactions[i].sent) {
              balanceHistory = balanceHistory.plus(amount);
            } else {
              balanceHistory = balanceHistory.minus(amount);
            }
            hist.push(balanceHistory);
          }
          for (let i = this.latestTransactions.length - 1; i >= 0; i--) {
            this.chartBalanceData.labels.push(this.$options.filters.toDate(this.latestTransactions[i].date, 'short'));
            this.chartBalanceData.datasets[0].data.push(hist[i]);
          }
        })
        .catch((error) => {
          this.loading = false;
          this.oops = true;
        });
    }
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

</style>
