Page({
    data: {
        weekNo: 1,
        weekDate: [],
        weekList: [],
        course: null,
        today: [],
        tolog:'none',
        tipS:'none',
        re_url:'../../assets/icon/renovate.png',
        // screen: {
        //     width: null,
        //     height: null
        // },
        left: '',
        top: '',
        loading: 'loading',
        mask: 'none'
    },
    methods: {
        randomColor: {
            colors: ["#feacaf", "#93d4e7", "#a1dd9f", "#f98cb1", "#93c0f7", "#dae489", "#89b2e4", "#88d5da", "#88da9f", "#dacb88", "#e8c39c", "#eebbb4", "#eeb4e8", "#d6b1f2", "#fddc5"],
            arr: [],
            color() {
                if (this.arr.length >= this.colors.length) {
                    this.arr = []
                }
                let randomNo = () => {
                    let no = parseInt(Math.random() * this.colors.length),
                        mark = true
                    for (let i = 0; i < this.arr.length; i++) {
                        if (this.arr[i] == no) {
                            mark = false
                        }
                    }
                    if (mark == true) {
                        this.arr.push(no)
                    } else {
                        randomNo()
                    }
                }
                randomNo()
                return this.colors[this.arr.slice(-1)]
            },
            fixColor(courseName) { //根据设计的需求，每个课程采用固定颜色填充
                let allSubject = wx.getStorageSync("allSubject")
                for (let i = 0; i < allSubject.length; i++) {
                    if (courseName == allSubject[i]) {
                        return this.colors[i]
                    }
                }
            }
        }, //返回一个不重复的随机色
        reflash(self){
          let course = wx.getStorageSync('course')
          for (let i in course) {
            for (let m in course[i]) {
              for (let k in course[i][m])
                if ('color' in course[i][m][k])
                  course[i][m].splice(k, 1)
            }
          }
          wx.setStorageSync('course', course)
          let blank = {
            creatNew: function () {
              let blank = {
                color: null
              }
              return blank
            }
          } // 定义空白块          
          for (let i in course) {
            for (let m in course[i]) {
              if (course[i][m].length == 0) {
                let _blank = blank.creatNew()
                _blank.flex = 12
                course[i][m].splice(0, 0, _blank)
              } // 当天没有课
              else {
                for (let t = 0; t < course[i][m].length; t++) {
                  if (t == 0 && course[i][m][0].start != 1) {
                    let _blank = blank.creatNew()
                    _blank.flex = course[i][m][0].start - 1
                    course[i][m].splice(0, 0, _blank)
                  } // 第一节课之前有空白
                  else if (t != 0 && course[i][m][t - 1].start + course[i][m][t - 1].flex < course[i][m][t].start) {
                    let _blank = blank.creatNew()
                    _blank.flex = course[i][m][t].start - course[i][m][t - 1].start - course[i][m][t - 1].flex
                    course[i][m].splice(t, 0, _blank)
                  } // 两节课之间有空白                             
                }
                // 最后一节课之后有空白 
                let _blank = blank.creatNew()
                let max = course[i][m].length - 1
                _blank.flex = 13 - course[i][m][max].start - course[i][m][max].flex
                course[i][m].push(_blank)
              }
            }
          }
          wx.setStorageSync('course', course)
        },//重新写入空白快
        setCourse(self) {
            let fillColor = () => {
                    let course = wx.getStorageSync('course')[self.data.weekNo]
                    for (let i in course) {
                        for (let m = 0; m < course[i].length; m++) {
                            if (course[i][m].color !== null) {
                                // course[i][m].color = self.methods.randomColor.color()
                                course[i][m].color = self.methods.randomColor.fixColor(course[i][m].kcmc) //填充该科目固定颜色
                            }
                        }
                    }
                    self.setData({
                        course: course
                    })
                } // 填充颜色
            let week = () => {
                    let date = new Date()
                    let m = date.getMonth() + 1;
                    m = m < 10 ? ('0' + m) : m;
                    let d = date.getDate();
                    d = d < 10 ? ('0' + d) : d;
                    let today = m + '-' + d
                    let calendar = wx.getStorageSync('calendar')
                    let firstDay = wx.getStorageSync('firstDay').slice(0, 10)
                        // 判断当前日期是否早于firstDay，若是，则返回第一周
                    console.log(Date.parse(date), Date.parse(firstDay))
                    if (Date.parse(date) < Date.parse(firstDay)) {
                        return {
                            weekNo: 1,
                            weekDate: calendar[0],
                        }
                    }
                    for (let i = 0; i < calendar.length; i++) {
                        for (let m = 0; m < calendar[i].length; m++) {
                            if (today == calendar[i][m]) {
                                return {
                                    weekNo: i + 1,
                                    weekDate: calendar[i]
                                }
                            }
                        }
                    }
                } // 返回当前周  
            let date = new Date()
            let today = date.getDay()
            if (today == 0) today = 7
            let weekDay = {
                currentTarget: {
                    dataset: {
                        value: today
                    }
                }
            }
             self.handleToday(weekDay) // 高亮今日
             let weekList = []
             if (wx.getStorageSync('weekList')) {
                 weekList = wx.getStorageSync('weekList')
             } else {
                 let calendar = wx.getStorageSync('calendar')
                for (let i = 0; i < calendar.length; i++) {
                     weekList[i] = '第' + Number(i + 1) + '周'
                 } // weekList
             }
            self.setData({
                weekNo: week().weekNo,
                weekDate: week().weekDate,
                weekList: weekList
            })
            fillColor()
        }
    },
    onShow: function() {
        let self = this
        let start = () => {
            let promise = new Promise(function(resolve, reject) {
                let timer = setInterval(function() {
                    let app = getApp()
                    if (app.data.userInfo) {
                        clearInterval(timer)
                        if (wx.getStorageSync('calendar')) {
                            resolve()
                        } // 如有calendar则resolve
                        else {
                            wx.request({
                              url: 'https://wegdut.yoricklee.com/calendarNext',
                                method: 'GET',
                                success: (res) => {
                                    if (res.statusCode == 200) {
                                        wx.setStorageSync('firstDay', res.data.data.firstDay)
                                        wx.setStorageSync('calendar', res.data.data.calendar)
                                        resolve()
                                    }
                                }
                            })
                        } // 没有calendar，则请求calendar                
                    }
                }, 1000)
            })
            return promise
        }
        start().then(() => {
            if (wx.getStorageSync('course')) {
                self.methods.setCourse(self)
                self.setData({
                    loading: null,
                    tolog: 'none'
                })
            } else {
                wx.request({
                    url: 'https://wegdut.yoricklee.com/jwgl/courseNext',
                    method: 'POST',
                    data: {
                        token: wx.getStorageSync('token')
                    },
                    success: (res) => {
                      console.log(res.data.data.rows)
                        if (res.data.code == 200) {
                            let _course = res.data.data.rows,
                                course = {},
                                weekMax = 1
                            wx.setStorageSync('subjectNo', _course.length)
                                //获取所有科目
                            let allSubject = []
                            allSubject.push(_course[0].kcmc)
                            for (let i = 0; i < _course.length; i++) {
                                for (let j = 0; j < allSubject.length; j++) {
                                    if (_course[i].kcmc == allSubject[j]) break
                                    if ((j == allSubject.length - 1) && (_course[i].kcmc != allSubject[j])) {
                                        allSubject.push(_course[i].kcmc)
                                    }
                                }
                            }
                            for (let i = 0; i < allSubject.length; i++) {
                                if (allSubject[i].length > 6) {
                                    allSubject[i] = allSubject[i].slice(0, 5) + '…'
                                } // 课程名过长则切掉
                            }
                            wx.setStorageSync("allSubject", allSubject)
                                //新增，获取所有科目，用以安排固定颜色（弃用随机颜色）
                            for (let i = 0; i < _course.length; i++) {
                                if (Number(_course[i].zc) > weekMax) {
                                    weekMax = _course[i].zc
                                }
                            } // 最大周数                      
                            for (let i = 1; i <= 20; i++) {
                                course[i] = {}
                                for (let m = 1; m < 8; m++) {
                                    course[i][m] = []
                                }
                            } // 初始化course
                            for (let i = 0; i < _course.length; i++) {
                                course[_course[i].zc][_course[i].xq].push(_course[i])
                            } // 填充数据
                            for (let i in course) {
                                for (let m in course[i]) {
                                    for (let t = 0; t < course[i][m].length; t++) {
                                        course[i][m][t].jxcdmc = '@ ' + course[i][m][t].jxcdmc
                                        //course[i][m][t].pkrq = course[i][m][t].pkrq.slice(5, 10) // 初始化日期
                                        course[i][m][t].flex = parseInt(course[i][m][t].xs)// 初始化长度
                                        course[i][m][t].start = Number(course[i][m][t].jcdm.slice(0, 2)) // 初始化位置
                                        if (course[i][m][t].kcmc.length > 6) {
                                            course[i][m][t].kcmc = course[i][m][t].kcmc.slice(0, 5) + '…'
                                        } // 课程名过长则切掉
                                    }
                                }
                            }
                            for (let i in course) {
                                for (let m in course[i]) {
                                    for (let t = 0; t < course[i][m].length; t++) {
                                        for (let j = t; j < course[i][m].length; j++) {
                                            if (course[i][m][t].start > course[i][m][j].start) {
                                                let temp = course[i][m][t]
                                                course[i][m][t] = course[i][m][j]
                                                course[i][m][j] = temp
                                            } else if (course[i][m][t].start==course[i][m][j].start){
                                              if (course[i][m][t].kcmc!=course[i][m][j].kcmc){
                                                console.log(course[i][m][t].kcmc+course[i][m][j].kcmc)
                                              }
                                            }

                                        }
                                    }
                                }
                            } // 课程排序
                            let blank = {
                                    creatNew: function() {
                                        let blank = {
                                            color: null
                                        }
                                        return blank
                                    }
                                } // 定义空白块          
                            for (let i in course) {
                                for (let m in course[i]) {
                                    if (course[i][m].length == 0) {
                                        let _blank = blank.creatNew()
                                        _blank.flex = 12
                                        course[i][m].splice(0, 0, _blank)
                                    } // 当天没有课
                                    else {
                                        for (let t = 0; t < course[i][m].length; t++) {
                                            if (t == 0 && course[i][m][0].start != 1) {
                                                let _blank = blank.creatNew()
                                                _blank.flex = course[i][m][0].start - 1
                                                course[i][m].splice(0, 0, _blank)
                                            } // 第一节课之前有空白
                                            else if (t != 0 && course[i][m][t - 1].start + course[i][m][t - 1].flex < course[i][m][t].start) {
                                                let _blank = blank.creatNew()
                                                _blank.flex = course[i][m][t].start - course[i][m][t - 1].start - course[i][m][t - 1].flex
                                                course[i][m].splice(t, 0, _blank)
                                            } // 两节课之间有空白                             
                                        }
                                        // 最后一节课之后有空白 
                                        let _blank = blank.creatNew()
                                        let max = course[i][m].length - 1
                                        _blank.flex = 13 - course[i][m][max].start - course[i][m][max].flex
                                        course[i][m].push(_blank)
                                    }
                                }
                            }
                            wx.setStorageSync('course', course)
                            self.methods.setCourse(self)
                            self.setData({
                                loading: null,
                                tolog: 'none',
                                tipS: 'block',
                            })
                        } else {
                          self.setData({
                            loading: null,
                            tolog:'block'
                          })
                                    /*wx.navigateTo({
                                        url: '/pages/me/bind/bind'
                                    })*/
                        }
                    },
                    fail: self.setData({
                      loading: null,
                      tolog: 'block'
                    })
                })
            }
        })
    },
    handleToday(e) {
        let today = []
        for (let i = 0; i < 7; i++) {
            if (e.currentTarget.dataset.value - 1 == i) {
                today[i] = {}
                today[i].flex = 1.5
                today[i].color = 'select'
            } else {
                today[i] = {}
                today[i].flex = 1
            }
        }
        this.setData({
            today: today
        })
    }, // 点击变宽
    delete_cou(){
      let self = this
      let cour=self.data.cour
      let course = wx.getStorageSync('course')
      console.log(course[1][5])
      for (let i = 1; i < Object.keys(course).length; i++) {
        for (let j = 0; j < course[i][cour.xq].length; j++)
          if ((course[i][cour.xq][j].kcmc == cour.kcmc) && (course[i][cour.xq][j].jcdm == cour.jcdm))
            course[i][cour.xq].splice(j, 1)
      }
      self.setData({
        mask: 'none',
      })
      wx.setStorageSync('course', course)
      self.methods.reflash(self)
      self.methods.setCourse(self)
    },
    renovate(e){ 
      let start = () => {
        let promise = new Promise(function (resolve, reject) {
          let timer = setInterval(function () {
            let app = getApp()
            if (app.data.userInfo) {
              clearInterval(timer)      
                wx.request({
                  url: 'https://wegdut.yoricklee.com/calendarNext',
                  method: 'GET',
                  success: (res) => {
                    if (res.statusCode == 200) {
                      wx.setStorageSync('firstDay', res.data.data.firstDay)
                      wx.setStorageSync('calendar', res.data.data.calendar)
                      resolve()
                    }
                  }
                }) // 没有calendar，则请求calendar                
            }
          }, 1000)
        })
        return promise
      }
      start().then(() => {
          wx.request({
            url: 'https://wegdut.yoricklee.com/jwgl/courseNext',
            method: 'POST',
            data: {
              token: wx.getStorageSync('token')
            },
            success: (res) => {
              console.log(res.data.data.rows)
              if (res.data.code == 200) {
                let _course = res.data.data.rows,
                  course = {},
                  weekMax = 1
                wx.setStorageSync('subjectNo', _course.length)
                //获取所有科目
                let allSubject = []
                allSubject.push(_course[0].kcmc)
                for (let i = 0; i < _course.length; i++) {
                  for (let j = 0; j < allSubject.length; j++) {
                    if (_course[i].kcmc == allSubject[j]) break
                    if ((j == allSubject.length - 1) && (_course[i].kcmc != allSubject[j])) {
                      allSubject.push(_course[i].kcmc)
                    }
                  }
                }
                for (let i = 0; i < allSubject.length; i++) {
                  if (allSubject[i].length > 6) {
                    allSubject[i] = allSubject[i].slice(0, 5) + '…'
                  } // 课程名过长则切掉
                }
                wx.setStorageSync("allSubject", allSubject)
                //新增，获取所有科目，用以安排固定颜色（弃用随机颜色）
                for (let i = 0; i < _course.length; i++) {
                  if (Number(_course[i].zc) > weekMax) {
                    weekMax = _course[i].zc
                  }
                } // 最大周数                      
                for (let i = 1; i <= 20; i++) {
                  course[i] = {}
                  for (let m = 1; m < 8; m++) {
                    course[i][m] = []
                  }
                } // 初始化course
                for (let i = 0; i < _course.length; i++) {
                  course[_course[i].zc][_course[i].xq].push(_course[i])
                } // 填充数据
                for (let i in course) {
                  for (let m in course[i]) {
                    for (let t = 0; t < course[i][m].length; t++) {
                      course[i][m][t].jxcdmc = '@ ' + course[i][m][t].jxcdmc
                      //course[i][m][t].pkrq = course[i][m][t].pkrq.slice(5, 10) // 初始化日期
                      course[i][m][t].flex = parseInt(course[i][m][t].xs)// 初始化长度
                      course[i][m][t].start = Number(course[i][m][t].jcdm.slice(0, 2)) // 初始化位置
                      if (course[i][m][t].kcmc.length > 6) {
                        course[i][m][t].kcmc = course[i][m][t].kcmc.slice(0, 5) + '…'
                      } // 课程名过长则切掉
                    }
                  }
                }
                for (let i in course) {
                  for (let m in course[i]) {
                    for (let t = 0; t < course[i][m].length; t++) {
                      for (let j = t; j < course[i][m].length; j++) {
                        if (course[i][m][t].start > course[i][m][j].start) {
                          let temp = course[i][m][t]
                          course[i][m][t] = course[i][m][j]
                          course[i][m][j] = temp
                        }
                      }
                    }
                  }
                } // 课程排序
                let blank = {
                  creatNew: function () {
                    let blank = {
                      color: null
                    }
                    return blank
                  }
                } // 定义空白块          
                for (let i in course) {
                  for (let m in course[i]) {
                    if (course[i][m].length == 0) {
                      let _blank = blank.creatNew()
                      _blank.flex = 12
                      course[i][m].splice(0, 0, _blank)
                    } // 当天没有课
                    else {
                      for (let t = 0; t < course[i][m].length; t++) {
                        if (t == 0 && course[i][m][0].start != 1) {
                          let _blank = blank.creatNew()
                          _blank.flex = course[i][m][0].start - 1
                          course[i][m].splice(0, 0, _blank)
                        } // 第一节课之前有空白
                        else if (t != 0 && course[i][m][t - 1].start + course[i][m][t - 1].flex < course[i][m][t].start) {
                          let _blank = blank.creatNew()
                          _blank.flex = course[i][m][t].start - course[i][m][t - 1].start - course[i][m][t - 1].flex
                          course[i][m].splice(t, 0, _blank)
                        } // 两节课之间有空白                             
                      }
                      // 最后一节课之后有空白 
                      let _blank = blank.creatNew()
                      let max = course[i][m].length - 1
                      _blank.flex = 13 - course[i][m][max].start - course[i][m][max].flex
                      course[i][m].push(_blank)
                    }
                  }
                }
                wx.setStorageSync('course', course)
                self.methods.setCourse(self)
                self.setData({
                  loading: null,
                  tolog: 'none'
                })
              } else {
                self.setData({
                  loading: null,
                  tolog: 'block'
                })
                /*wx.navigateTo({
                    url: '/pages/me/bind/bind'
                })*/
              }
            },
            fail: wx.navigateTo({
              url: '/pages/me/bind/bind'
            })
          })
      })
    },
    handleWeek(e) {
        let index = Number(e.detail.value),
            course = null
        
        if (index + 1 in wx.getStorageSync('course')) {
            course = wx.getStorageSync('course')[index + 1]
            for (let i in course) {
                for (let m = 0; m < course[i].length; m++) {
                    if (course[i][m].color !== null) {
                        //course[i][m].color = this.methods.randomColor.color()
                        course[i][m].color = this.methods.randomColor.fixColor(course[i][m].kcmc) //以固定颜色填充该科目
                    }
                }
            }
        }
        this.setData({
            weekNo: index + 1,
            course: course,
            weekDate: wx.getStorageSync('calendar')[index]
        })
    }, 
    handletolog(e){
      wx.navigateTo({
        url: '/pages/me/bind/bind'
      })
    },

    closecour(e) {
        let self = this
        self.setData({
            mask: 'none',
        })
    },
    showcour(e) {
        let self = this
        let cour = e.currentTarget.dataset.one;
        console.log(cour)
        if (cour.kcmc)
            self.setData({
                mask: 'flex',
                cour: cour
            })
    },
    handleknow(){
      this.setData({
        tipS: 'none',
      })
    },
    onShareAppMessage() {
        let subjectNo = wx.getStorageSync('subjectNo')
        let price = parseInt(2850 / subjectNo)
        return {
            title: '我这学期共' + subjectNo + '节课,每节课' + price + '元,来看看你的吧！',
            path: '/pages/course/course'
        }
    }
})