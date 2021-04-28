export const getList = {
  data() {
    return {
      pageNum: 1,
      pageSize: 20,
      // total: 0,
      // totalPages: 0,
      list: [],
      status: 'loading',
      noMore: false,
      loadText: {
        loadmore: '轻轻上拉',
        loading: '努力加载中',
        nomore: '实在没有了',
      },
    }
  },
  onLoad() {
    this.getList(true)
  },
  methods: {
    currentChange(val) {
      this.pageNum = val
      this.getList(true)
    },
    handleResFromMixin(res, mapFn = v => v, isRefresh = false) {
      const { data } = res
      const transformedList = (data || []).map(mapFn)
      if (isRefresh) {
        this.list = transformedList
      } else {
        this.list = this.list.concat(transformedList)
      }
      if (transformedList.length < this.pageSize) {
        this.noMore = true
        this.status = 'nomore'
      }
    },
  },
  onPullDownRefresh() {
    this.pageNum = 1
    this.noMore = false
    this.status = ''
    this.getList(true)
  },
  onReachBottom() {
    if (!this.noMore) {
      this.status = 'loading';
      this.pageNum++
      this.getList()
    }
  },
}
