import type { PaginationInfo, PaginationProps } from 'naive-ui'
import type {
  ProTablePagination,
  ProTableRequestResult,
  ProTableSetupProps,
  ProTableSorter,
} from './types'
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useProLocale } from '../../config-provider'

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 10
const DEFAULT_PAGE_SIZES = [10, 20, 50, 100]

/** 管理 ProTable 的远程请求、分页和查询状态。 */
export function useProTableRequest(props: ProTableSetupProps) {
  const locale = useProLocale()
  const params = ref<Record<string, unknown>>({ ...props.defaultParams })
  const remoteData = ref<ProTableRequestResult['data']>([])
  const requestLoading = ref(false)
  const total = ref(0)
  const page = ref(readPage(props.pagination))
  const pageSize = ref(readPageSize(props.pagination))
  const sorter = ref<ProTableSorter>(null)
  let latestRequestId = 0

  const data = computed(() => props.request ? remoteData.value : props.data)
  const loading = computed(() => props.loading || requestLoading.value)
  const remote = computed(() => !!props.request)
  const pagination = computed<ProTablePagination>(() =>
    getPagination(props, page.value, pageSize.value, total.value, locale('totalPrefix')),
  )
  const index = computed(() =>
    props.pagination === false ? 0 : (page.value - 1) * pageSize.value,
  )

  watch(
    () => getControlledPage(props.pagination),
    (nextPage) => {
      if (nextPage !== undefined) {
        page.value = nextPage
      }
    },
  )

  watch(
    () => getControlledPageSize(props.pagination),
    (nextPageSize) => {
      if (nextPageSize !== undefined) {
        pageSize.value = nextPageSize
      }
    },
  )

  async function request(extra: Record<string, unknown> = {}) {
    if (!props.request) {
      return undefined
    }

    const requestId = ++latestRequestId
    requestLoading.value = true
    try {
      return await performRequest(requestId, extra)
    }
    catch (error) {
      if (requestId === latestRequestId) {
        props.onRequestError?.(error)
      }
      throw error
    }
    finally {
      if (requestId === latestRequestId) {
        requestLoading.value = false
      }
    }
  }

  async function performRequest(
    requestId: number,
    extra: Record<string, unknown>,
  ): Promise<ProTableRequestResult | undefined> {
    const firstResult = await props.request?.(buildRequestParams(extra))
    if (!firstResult || requestId !== latestRequestId) {
      return firstResult
    }

    const fallbackPage = getFallbackPage(
      normalizeTotal(firstResult.total, firstResult.data.length),
      page.value,
      pageSize.value,
    )
    if (fallbackPage !== page.value) {
      page.value = fallbackPage
      const fallbackResult = await props.request?.(buildRequestParams(extra))
      return commitResult(fallbackResult, requestId)
    }
    return commitResult(firstResult, requestId)
  }

  function commitResult(
    result: ProTableRequestResult | undefined,
    requestId: number,
  ) {
    if (!result || requestId !== latestRequestId) {
      return result
    }
    remoteData.value = Array.isArray(result.data) ? result.data : []
    total.value = normalizeTotal(result.total, remoteData.value.length)
    return result
  }

  function buildRequestParams(extra: Record<string, unknown>): Record<string, unknown> {
    return {
      ...params.value,
      ...formatSorter(sorter.value),
      ...extra,
      [props.pageFields.page]: page.value,
      [props.pageFields.pageSize]: pageSize.value,
    }
  }

  async function search(nextParams?: Record<string, unknown>) {
    if (nextParams) {
      params.value = { ...params.value, ...nextParams }
    }
    page.value = DEFAULT_PAGE
    return request()
  }

  async function reset(nextParams: Record<string, unknown> = { ...props.defaultParams }) {
    params.value = { ...nextParams }
    sorter.value = null
    page.value = DEFAULT_PAGE
    return request()
  }

  function setParams(nextParams: Record<string, unknown>) {
    params.value = { ...nextParams }
  }

  function updateParams(nextParams: Record<string, unknown>) {
    params.value = { ...params.value, ...nextParams }
  }

  function updatePage(nextPage: number) {
    page.value = nextPage
    runSafelyRequest()
  }

  function updatePageSize(nextPageSize: number) {
    page.value = DEFAULT_PAGE
    pageSize.value = nextPageSize
    runSafelyRequest()
  }

  function updateSorter(nextSorter: ProTableSorter) {
    sorter.value = nextSorter
    runSafelyRequest()
  }

  function runSafelyRequest() {
    void request().catch(() => undefined)
  }

  onMounted(() => {
    if (props.request && !props.manual) {
      runSafelyRequest()
    }
  })

  onBeforeUnmount(() => {
    latestRequestId++
    requestLoading.value = false
  })

  return {
    data,
    index,
    loading,
    page,
    pageSize,
    pagination,
    params,
    reload: request,
    remote,
    request,
    reset,
    search,
    setParams,
    updatePage,
    updatePageSize,
    updateParams,
    updateSorter,
  }
}

function getPagination(
  props: ProTableSetupProps,
  pageVal: number,
  pageSizeVal: number,
  totalVal: number,
  totalPrefix: string,
): ProTablePagination {
  if (props.pagination === false) {
    return false
  }
  const pagination: PaginationProps = {
    pageSizes: DEFAULT_PAGE_SIZES,
    prefix: (info: PaginationInfo) => `${totalPrefix} ${info.itemCount ?? 0} 条`,
    showQuickJumper: true,
    showSizePicker: true,
    ...props.pagination,
  }
  if (!props.request) {
    return pagination
  }
  return {
    ...pagination,
    itemCount: totalVal,
    page: pageVal,
    pageSize: pageSizeVal,
  }
}

function readPage(pagination: false | PaginationProps): number {
  return pagination === false
    ? DEFAULT_PAGE
    : pagination.page ?? pagination.defaultPage ?? DEFAULT_PAGE
}

function readPageSize(pagination: false | PaginationProps): number {
  return pagination === false
    ? DEFAULT_PAGE_SIZE
    : pagination.pageSize ?? pagination.defaultPageSize ?? DEFAULT_PAGE_SIZE
}

function getControlledPage(pagination: false | PaginationProps) {
  return pagination === false ? undefined : pagination.page
}

function getControlledPageSize(pagination: false | PaginationProps) {
  return pagination === false ? undefined : pagination.pageSize
}

function getFallbackPage(totalVal: number, pageVal: number, pageSizeVal: number) {
  const lastPage = Math.max(DEFAULT_PAGE, Math.ceil(Math.max(0, totalVal) / pageSizeVal))
  return Math.min(pageVal, lastPage)
}

function normalizeTotal(value: unknown, fallback: number): number {
  if ((typeof value !== 'number' && typeof value !== 'string') || value === '') {
    return fallback
  }
  const total = Number(value)
  return Number.isFinite(total) ? Math.max(0, Math.trunc(total)) : fallback
}

function formatSorter(sorterVal: ProTableSorter): Record<string, string> {
  const sorters = (Array.isArray(sorterVal) ? sorterVal : [sorterVal])
    .filter((item: any) => item !== null && item.order !== false)
  const orderBy = sorters
    .map((item: any) => `${String(item?.columnKey)} ${item?.order === 'ascend' ? 'asc' : 'desc'}`)
    .join(',')
  return orderBy ? { orderBy } : {}
}
