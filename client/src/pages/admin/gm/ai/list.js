import '../../common.js'
import MyVuetable from '../../../../components/MyVuetable.vue'
import MyToastr from '../../../../components/MyToastr.vue'

new Vue({
  el: '#app',
  components: {
    MyVuetable,
    MyToastr,
  },
  data: {
    eventHub: new Vue(),
    loading: true,
    activatedRow: {},   //被点击的行
    searchAiFormData: {
      db: 10014,        //游戏后端数据库id
      game_type: '',    //游戏类型
      status: '',       //状态
    },

    serverList: {},
    gameType: {},
    statusType: {},

    serverListApi: '/admin/api/game/server',
    gameTypeApi: '/admin/api/game/ai/type-map',
    editAiApi: '/admin/api/game/ai',

    aiTableUrl: '/admin/api/game/ai/list',
    aiTableFields: [
      {
        name: 'rid',
        title: 'id',
      },
      {
        name: 'nick',
        title: '昵称',
      },
      {
        name: 'diamond',
        title: '钻石',
      },
      {
        name: 'crystal',
        title: '兑换券',
      },
      {
        name: 'exp',
        title: '经验',
      },
      {
        name: 'duration',
        title: '调用天数',
      },
      {
        name: 'game_type',
        title: '游戏类型',
      },
      {
        name: 'room_type',
        title: '房间类型',
      },
      {
        name: 'status',
        title: '状态',
      },
      {
        name: 'create_time',
        title: '创建时间',
      },
    ],
  },

  methods: {
    getAiTableUrl () {
      return '/admin/api/game/ai/list'
    },

    searchAiList () {
      //刷新表格
      this.aiTableUrl = this.getAiTableUrl() + `?db=${this.searchAiFormData.db}`
        + `&game_type=${this.searchAiFormData.game_type}`
        + `&status=${this.searchAiFormData.status}`
    },

    editAi () {
      let _self = this
      let toastr = this.$refs.toastr

      this.loading = true
      axios.put(this.editAiApi, this.activatedRow)
        .then((response) => {
          _self.loading = false
          return response.data.error
            ? toastr.message(response.data.error, 'error')
            : toastr.message(response.data.message)
        })
    },

    aiListButtonAction () {
      this.aiTableUrl = this.getAiTableUrl()
      this.searchAiFormData = {
        db: 10014,
        game_type: '',
        status: '',
      }
    },
  },

  created: function () {
    let _self = this

    axios.get(this.serverListApi)
      .then((res) => _self.serverList = res.data)
    axios.get(this.gameTypeApi)
      .then((res) => {
        _self.gameType = res.data.game_type
        _self.statusType = res.data.status_type
      })

    this.loading = false
  },

  mounted: function () {
    let _self = this
    this.$root.eventHub.$on('vuetableCellClicked', (data) => {
      _self.activatedRow = data
      jQuery('#edit-ai-modal-button').click()   //打开编辑AI模态框
    })
  },
})