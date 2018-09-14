Page({
    data: {
        bindWindowIsHidden:true,
        neverBind:true,
        photoURL:"",
        id:null,
        password:null,
        book:null,
        loading: null,
    },
    onLoad: function () { 
      console.log("test")  
      wx.getUserInfo({
        success: function (res) {
          // var userInfo = res.userInfo
          // var nickName = userInfo.nickName
          // var avatarUrl = userInfo.avatarUrl
          // var gender = userInfo.gender //性别 0：未知、1：男、2：女
          // var province = userInfo.province
          // var city = userInfo.city
          // var country = userInfo.country
          console.log(res.userInfo.avatarUrl)
          this.setData({
            photoURL: res.userInfo.avatarUrl,
          })
        },
        fail:function(res){
          console.log(res)
        }
      })
    },
    handleShowBindWindow(){
      this.setData({
        bindWindowIsHidden: false,
      })
    },
    handleHindBindWindow(){
      this.setData({
        bindWindowIsHidden: true,
      })
    },
    handleIdInput(e) {
      this.data.id = Number(e.detail.value)
    },
    handlePasswordInput(e) {
      this.data.password = e.detail.value
    },
    handleBind(){
      console.log(this.data.id)
      console.log(this.data.password)
      wx.request({
        // 教务系统登录 post 参数 username && password && yzm && cookie 返回200 成功 500 登录失败 402 缺少参数
        url: 'https://wegdut.yoricklee.com/gdutlibrary/login',
        data: {
          username:this.data.id,
          password:this.data.password
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
        },
        fail:(res) => {
          console.log(res)
        }
      })
    }
    // handleTabClick(e) {
    //     this.setData({
    //         sliderOffset: e.currentTarget.offsetLeft,
    //         current: e.currentTarget.id
    //     });
    // },
    // handleSwiper(e) {
    //     this.setData({
    //         sliderOffset: this.data.offsetLeft * Number(e.detail.current)
    //     })
    // },
    // onShareAppMessage() {
    //     let bookName = this.data.info[0]
    //     let CtrlRd = this.data.CtrlRd
    //     let CtrlNo = this.data.CtrlNo
    //     return {
    //         title: '《' + bookName + '》这本书推荐给你！',
    //         path: '/pages/me/library/book/book?CtrlRd=' + CtrlRd  + '&title=好友推荐'  + '&CtrlNo=' + CtrlNo
    //     }
    // }
});