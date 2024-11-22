<script setup lang="ts" name="App">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { type PageList, type Rs, type RevenueData } from '../types'

/** 總筆數 */
const total = ref(0)
/** 總頁數 */
const totalPage = ref(0)
/** 查詢參數 */
const pagelist: PageList = reactive({
  /** 頁數 */
  page: 1,
  /** 每頁幾筆 */
  pageSize: 10,
})

/** 收入資料 */
const revenueData: Array<RevenueData> = reactive([])

/** 分頁 */
const paginationArr = computed(() => {
  const extendedNumber = 5
  let minNum = 0
  let maxNum = 0

  for (let i = 1; i <= extendedNumber; i++) {
    if (pagelist.page - i < 1) {
      minNum = 1
      break
    }

    minNum = pagelist.page - i
  }

  for (let i = 1; i <= extendedNumber; i++) {
    if (pagelist.page + i > totalPage.value) {
      maxNum = totalPage.value
      break
    }

    maxNum = pagelist.page + i
  }

  return [...Array(maxNum - minNum + 1)].map((_, index) => minNum + index)
})

/** 呈現當前筆數 */
const showCurrentNum = computed(() => {
  return pagelist.pageSize * (pagelist.page - 1) + 1 + '~' + pagelist.pageSize * pagelist.page
})

/** 四捨五入至小數第二位 */
function tofixed2(num: number | null) {
  if (num === null) return ''

  return parseFloat(num.toFixed(2))
}

/**
 * 取得收入
 * @param pagelist 查詢參數
 */
async function getRevenue(pagelist: PageList) {
  try {
    const response = await fetch(
      `https://localhost:7184/api/ESUN?page=${pagelist.page}&pageSize=${pagelist.pageSize}`,
    )
    if (!response.ok) {
      throw new Error('網路回應失敗！')
    }

    if (revenueData.length > 0) {
      revenueData.splice(0, revenueData.length)
    }

    const result = (await response.json()) as Rs

    if (result.data) {
      Object.assign(revenueData, result.data)
      total.value = revenueData[0].total
      totalPage.value = Math.ceil(total.value / pagelist.pageSize)
    }
  } catch (error) {
    console.error(error)
  }
}

watch(
  [() => pagelist.pageSize],
  async () => {
    pagelist.page = 1
    await getRevenue(pagelist)
  },
  { deep: true },
)

onMounted(async () => {
  await getRevenue(pagelist)
})
</script>

<template>
  <table>
    <caption>
      <select v-model="pagelist.pageSize">
        <option :value="10">10</option>
        <option :value="25">25</option>
        <option :value="50">50</option>
        <option :value="100">100</option>
      </select>
      公司營收報告
    </caption>
    <thead>
      <tr>
        <th>出表日期</th>
        <th>資料年月</th>
        <th>公司代號</th>
        <th>公司名稱</th>
        <th>產業名稱</th>
        <th>營業收入-當月營收</th>
        <th>營業收入-上月營收</th>
        <th>營業收入-去年當月營收</th>
        <th>營業收入-上月比較增減(%)</th>
        <th>營業收入-去年同月增減(%)</th>
        <th>累計營業收入-當月累計營收</th>
        <th>累計營業收入-去年累計營收</th>
        <th>累計營業收入-前期比較增減(%)</th>
        <th>備註</th>
      </tr>
    </thead>
    <tbody>
      <!-- 以下數據可以繼續複製並添加其他資料 -->
      <tr v-for="(r, i) in revenueData" :key="i">
        <td>{{ r.publishDate }}</td>
        <td>{{ r.year_Date }}</td>
        <td>{{ r.companyCode }}</td>
        <td>{{ r.companyName }}</td>
        <td>{{ r.industryName }}</td>
        <td>{{ r.revenue_CurrentMonth }}</td>
        <td>{{ r.revenue_PreviousMonth }}</td>
        <td>{{ r.revenue_SameMonthLastYear }}</td>
        <td>{{ tofixed2(r.revenue_MonthOverMonthGrowthPct) }}</td>
        <td>{{ tofixed2(r.revenue_YearOverYearGrowthPct) }}</td>
        <td>{{ r.cumulativeRevenue_CurrentMonth }}</td>
        <td>{{ r.cumulativeRevenue_LastYear }}</td>
        <td>{{ tofixed2(r.cumulativeRevenue_PeriodOverPeriodGrowthPct) }}</td>
        <td>{{ r.memo }}</td>
      </tr>
      <!-- 在這裡繼續增加其他資料 -->
    </tbody>
  </table>
  <!-- 分頁區域 -->
  <div class="footer">
    <div>
      <span>顯示 {{ showCurrentNum }} 筆，共 {{ total }} 筆</span>
    </div>
    <div class="pagination">
      <button
        class="prev"
        @click="pagelist.page--"
        v-show="!(pagelist.page === 1 || pagelist.page <= 0)"
      >
        上一頁
      </button>
      <span
        v-for="n in paginationArr"
        :key="n"
        class="page-number"
        :class="n === pagelist.page ? 'active' : ''"
        @click="pagelist.page = n"
        >{{ n }}</span
      >
      <button
        class="next"
        v-show="!(pagelist.page === totalPage || totalPage === 0 || totalPage === 1)"
        @click="pagelist.page++"
      >
        下一頁
      </button>
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: Arial, sans-serif;
  background-color: #f4f4f9;
  margin: 0;
  padding: 20px;
  padding-bottom: 40px;
  box-sizing: border-box;
}

table {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  margin-top: 20px;
}

th,
td {
  padding: 12px 15px;
  text-align: center;
  border: 1px solid #ddd;
  word-wrap: break-word;
  font-size: 20px;
}

th {
  background-color: #4caf50;
  color: white;
}

tr:nth-child(even) {
  background-color: #f2f2f2;
}

tr:hover {
  background-color: #ddd;
}

caption {
  font-size: 30px;
  margin-bottom: 10px;
}

.pagination {
  text-align: right;
}

.pagination span {
  font-size: 20px;
  background-color: white;
  color: #333;
  border: 1px solid #333;
  padding: 8px 15px;
  border-radius: 5px;
  margin: 0 5px;
}

.pagination span.active {
  background-color: #4caf50;
}

.prev,
.next {
  font-size: 18px;
  background-color: white;
  color: #333;
  padding: 8px 15px;
  border-radius: 5px;
  margin: 0 5px;
  cursor: pointer;
}

.prev:hover,
.next:hover {
  background-color: #c3ffc4;
  cursor: pointer;
}

.pagination span:hover {
  background-color: #c3ffc4;
  cursor: pointer;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin: 0.75em 0;
  font-size: 25px;
}

select {
  font-size: 30px;
  float: left;
}
</style>
