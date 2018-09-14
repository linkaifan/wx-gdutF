// pages/me/slcore/slcore.js
Page({
  data:{
    name:null,
    id:null,
    verify:null,
    verify: null,
    verifyUrl:"../../../assets/icon/yzmDefault.png",
    verifyCookie:null,
    level:"请输入相关信息",
    score:"",
    date:"",
    listen:"",
    read:"",
    write:"",
    show:'none'
  },
  onShow: function () {
    wx.setNavigationBarTitle({
      title: '四六级查询'
    })
    // wx.request({
    //   url: 'https://wegdut.yoricklee.com/cet',
    //   data: {
    //     zkzh: "440380162119017",
    //     xm: "徐静"
    //   },
    //   method: 'POST',
    //   success: (res) => {
    //     console.log(res.data)
    //   }
    // })
    if (wx.getStorageSync("cetid")) {
      this.setData({
        id: wx.getStorageSync("cetid")
      })
    }
    if (wx.getStorageSync("cetname")) {
      this.setData({
        name: wx.getStorageSync("cetname")
      })
    }
    wx.request({
      url: "https://wegdut.yoricklee.com/cet/getYzm",
      data: {},
      method: "GET",
      success: (res) => {
        if (res.data.data.url == "" || res.data.data.url == null || res.data.data.url == undefined || res.data.data.url == false || res.data.data.url ==NaN){
          this.setData({
            verifyUrl: '../../../assets/icon/yzmDefault.png',
            verifyCookie: res.data.data.cookie,
          })
        }else{
          this.setData({
            verifyUrl: res.data.data.url,
            verifyCookie: res.data.data.cookie,
          })
        }
      }
    })
  },
  requestAnotherVerify() {
    wx.request({
      url: "https://wegdut.yoricklee.com/cet/getYzm",
      data: {},
      method: "GET",
      success: (res) => {
        if (res.data.data.url == "" || res.data.data.url == null || res.data.data.url == undefined || res.data.data.url == false || res.data.data.url == NaN) {
          this.setData({
            verifyUrl: '../../../assets/icon/yzmDefault.png',
            verifyCookie: res.data.data.cookie,
          })
        } else {
          this.setData({
            verifyUrl: res.data.data.url,
            verifyCookie: res.data.data.cookie,
          })
        }
      }
    })
  },
  handleNameInput(e) {
    this.data.name = e.detail.value
  },
  handleIdInput(e) {
    this.data.id = Number(e.detail.value)
  },
  handleVerifyInput(e) {
    this.data.verify = Number(e.detail.value)
  },
  handleBind() {
    let self = this
    if (this.data.id && this.data.name) {
      wx.showLoading({
        title: '查询中...',
        mask: true
      })
      console.log(
        {
          zkzh: this.data.id,
          xm: this.data.name,
          cookie: this.data.verifyCookie,
          yzm: this.data.verifyUrl
        }
      )
      wx.request({
        // 教务系统登录 post 参数 username && password && yzm && cookie 返回200 成功 500 登录失败 402 缺少参数
        url: 'https://wegdut.yoricklee.com/cet',
        data: {
          zkzh: this.data.id,
          xm: this.data.name,
          cookie: this.data.verifyCookie,
          yzm: this.data.verify
        },
        method: 'POST',
        success: (res) => {
          console.log(res)
          let allData = res.data
          wx.hideLoading()
          if (res.statusCode == 200) {
            if (!res.data.data.总分){
              wx.showModal({
                title: '提示',
                content: '查询出错',
                showCancel: false
              })
            }else{
              wx.setStorageSync("cetid", this.data.id)
              wx.setStorageSync("cetname", this.data.name)
              this.setData({
                level: res.data.data.级数,
                score: res.data.data.总分 + "分",
                listen: "听力：" + res.data.data.听说 + "分",
                read: "阅读：" + res.data.data.阅读理解 + "分",
                write: "写作：" + res.data.data.写作和翻译 + "分",
                date: res.data.data.时间,
                show: 'block'
            })
            }   
          }
          else if (res.statusCode == 502) {
            wx.showModal({
              title: '提示',
              content: '姓名或准考证号错误',
              showCancel: false
            })
          } 
        }
      })
    }
    else {
      wx.showModal({
        title: '提示',
        content: '请输入信息',
        showCancel: false
      })
    }
  },
  cut(str, start, middle, end){
    var stepOne = str.slice(str.indexOf(start) + start.length, str.indexOf(end, str.indexOf(start) + start.length))
    var stepTwo = stepOne.slice(stepOne.indexOf(middle) + middle.length)
    return parseInt(stepTwo) 
  },
  cutForLevel(str, start, end) {
    // console.log('<td colspan="2">'.length)
    var stepOne = str.slice(str.indexOf(start), str.indexOf(end, str.indexOf(start)))
    if (stepOne.match("英语四级")) { return "英语四级" }
    else if (stepOne.match("英语六级")) { return "英语六级" }
    else return "false"
  },
  cutForDate(str, start, middle, end) {
    var stepOne = str.slice(str.indexOf(start) + start.length, str.indexOf(end, str.indexOf(start) + start.length))
    var stepTwo = stepOne.slice(stepOne.indexOf(middle) + middle.length)
    var year = parseInt(stepTwo) + "年"
    // var stepThree = str.slice(str.indexOf(start),str.indexOf(end,str.indexOf(start)))
    if (stepOne.match("上半年")) { return year + "6月17日" }
    else if (stepOne.match("下半年")) { return year + "12月16日" }
    else return "false"
  },
  onShareAppMessage() {
    return {
      title: '我四六级考试通过了,快来看看你的吧！',
      path: 'pages/me/slcore/slcore'
    }
  }
})