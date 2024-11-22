export interface PageList {
  /** 頁碼 */
  page: number
  /** 一頁幾筆 */
  pageSize: number
}

export interface Rs {
  /** 資料 */
  data: unknown
  /** 細節 */
  details: string
  /** 訊息 */
  message: string
  /** 狀態碼 */
  status: number
}

export interface RevenueData {
  /** 出表日期 */
  publishDate: string
  /** 資料年月 */
  year_Date: string
  /** 公司代號 */
  companyCode: string
  /** 公司名稱 */
  companyName: string
  /** 產業名稱 */
  industryName: string
  /** 營業收入-當月營收 */
  revenue_CurrentMonth: number
  /** 營業收入-上月營收 */
  revenue_PreviousMonth: number
  /** 營業收入-去年當月營收 */
  revenue_SameMonthLastYear: number
  /** 營業收入-上月比較增減(%) */
  revenue_MonthOverMonthGrowthPct: number
  /** 營業收入-去年同月增減(%) */
  revenue_YearOverYearGrowthPct: number
  /** 累計營業收入-當月累計營收 */
  cumulativeRevenue_CurrentMonth: number
  /** 累計營業收入-去年累計營收 */
  cumulativeRevenue_LastYear: number
  /** 累計營業收入-前期比較增減(%) */
  cumulativeRevenue_PeriodOverPeriodGrowthPct: number
  /** 備註 */
  memo: string
  /** 共幾頁 */
  pageNum: number
  /** 共幾筆 */
  total: number
}
