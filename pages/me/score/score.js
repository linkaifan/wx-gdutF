Page({
    data: {
        term: ['全部', '大一上', '大一下', '大一全年', '大二上', '大二下', '大二全年', '大三上', '大三下', '大三全年', '大四上', '大四下', '大四全年'],
        termValue: '全部',
        scorePoint: null,
        score: null,
        score_s: null,
        tipS: 'none',
        tolog: 'none',
        loading: 'loading'
    },
    onLoad: function() {
        let self = this
        if (wx.getStorageSync('allScore')){
          let allScore=wx.getStorageSync('allScore')
          let allScoret = wx.getStorageSync('allScore')
          for (let i = 1; i < 5; i++) {
            if (allScoret['大' + numberToChinese(i) + '上']) {
              if (allScoret['大' + numberToChinese(i) + '下']) { allScore['大' + numberToChinese(i) + '全年'] = allScoret['大' + numberToChinese(i) + '上'].concat(allScoret['大' + numberToChinese(i) + '下']) } else { allScore['大' + numberToChinese(i) + '全年'] = allScoret['大' + numberToChinese(i) + '上'] }
            }
          }

          self.setData({
            score: allScore,
            loading: null,
            tolog: 'none',
            tipS: 'none'
          })
          self.fill()
          console.log(wx.getStorageSync('allScore'))
        } else {
          self.setData({
            tipS: 'block',
            loading: null,
            tolog: 'block'
          })
        }
        },
    onShow:function(){
      let self = this
      if(wx.getStorageSync('iflog')===true){
        wx.request({
          url: 'https://wegdut.yoricklee.com/jwgl/score',
          data: {
            token: wx.getStorageSync('token')
          },
          method: 'POST',
          success: (res) => {
            if (res.data.code == 200) {
              let allScore = res.data.data
              wx.setStorageSync('allScore', allScore)
              for (let i = 1; i < 5; i++) {
                if (res.data.data['大' + numberToChinese(i) + '上']) {
                  if (res.data.data['大' + numberToChinese(i) + '下']) { allScore['大' + numberToChinese(i) + '全年'] = res.data.data['大' + numberToChinese(i) + '上'].concat(res.data.data['大' + numberToChinese(i) + '下']) } else { allScore['大' + numberToChinese(i) + '全年'] = res.data.data['大' + numberToChinese(i) + '上'] }
                }
              }
              wx.setStorageSync('iflog',false)
              self.setData({
                tipS: 'block',
                score: allScore,
                loading: null,
                tolog: 'none'
              })
              self.fill()
            } else {
              self.setData({
                loading: null,
                tolog: 'none'
              })
            }
          }
        })
      }
      
    },
        
    fill() {
        let score_s = this.data.score[this.data.termValue]
        let handleScorePoint = () => {
                let sum = 0,
                    sum_xf = 0
                for (let i = 0; i < score_s.length; i++) {
                    sum = sum + score_s[i].cjjd * score_s[i].xf
                    sum_xf = sum_xf + Number(score_s[i].xf)
                }
                return (sum / sum_xf).toFixed(3)
            } // 计算加权绩点
        let handlePieChart = () => {
            const pencil = wx.createCanvasContext('pie-chart')
            let handlePercent = () => {
                let arr = [0, 0, 0, 0, 0]
                for (let i = 0; i < score_s.length; i++) {
                    if (score_s[i].zcj < 60) {
                        arr[0] = arr[0] + 1;
                    } else if (score_s[i].zcj < 70) {
                        arr[1] = arr[1] + 1
                    } else if (score_s[i].zcj < 80) {
                        arr[2] = arr[2] + 1;
                    } else if (score_s[i].zcj < 90) {
                        arr[3] = arr[3] + 1;
                    } else if (score_s[i].zcj < 100) {
                        arr[4] = arr[4] + 1;
                    }
                } // 取百分比
                    // 取百分比               
                let sum = 0
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = Number((arr[i] / score_s.length).toFixed(3))
                    sum = sum + arr[i]
                    arr[i] = sum.toFixed(3)
                } // 取小数点后三位
                return arr
            }
            let percent = handlePercent()
            let drawSector = (start, end, color) => {
                pencil.beginPath()
                pencil.moveTo(90, 90)
                pencil.arc(90, 90, 80, start * Math.PI * 2, end * Math.PI * 2)
                pencil.setFillStyle(color)
                pencil.closePath()
                pencil.fill()
            }
            let drawkong = (start, end, color) => {
              pencil.beginPath()
              pencil.moveTo(90, 90)
              pencil.arc(90, 90, 40,0,Math.PI * 2)
              pencil.setFillStyle(color)
              pencil.closePath()
              pencil.fill()
            }
            drawSector(0, percent[0], '#f98cb1' )
            drawSector(percent[0], percent[1], '#feacaf')
            drawSector(percent[1], percent[2], '#fbe9ab')
            drawSector(percent[2], percent[3], '#a1dd9f')
            drawSector(percent[3], 1, '#93d4e7')
            drawkong(0, 1, '#ffffff')
            pencil.draw()
        }
        handlePieChart()
         for (let i = 0; i < score_s.length; i++) {
                      if (score_s[i].zcj < 60) {
                        score_s[i].zcj = score_s[i].zcj+"分"
                        score_s[i].color = '#f98cb1'
                      } else if (score_s[i].zcj < 70) {
                        score_s[i].zcj = score_s[i].zcj + "分"
                        score_s[i].color = '#feacaf'
                      } else if (score_s[i].zcj < 80) {
                        score_s[i].zcj = score_s[i].zcj + "分"
                        score_s[i].color = '#fbe9ab'
                      } else if (score_s[i].zcj < 90) {
                        score_s[i].zcj = score_s[i].zcj + "分"
                        score_s[i].color = '#a1dd9f'
                      } else if (score_s[i].zcj < 100) {
                        score_s[i].zcj = score_s[i].zcj + "分"
                        score_s[i].color = '#93d4e7'
                      } else if (score_s[i].zcj=="良好") {
                        score_s[i].color = '#a1dd9f'
                      } else if (score_s[i].zcj == "优秀") {
                        score_s[i].color = '#93d4e7'
                      } else if (score_s[i].zcj == "中等") {
                        score_s[i].color = '#fbe9ab'
                      } else if (score_s[i].zcj == "及格") {
                        score_s[i].color = '#feacaf'
                      } else{
                        score_s[i].color = '#f98cb1'
                      }
                    }
        this.setData({
            score_s: score_s,
            scorePoint: handleScorePoint()
        })
    },
    handletolog(e) {
      wx.navigateTo({
        url: '/pages/me/bind/bind'
      })
    },
    handleknow(){
      this.setData({
        tipS: 'none',
      })
    },
    renovatescore(e){
      let self = this
      wx.request({
            url: 'https://wegdut.yoricklee.com/jwgl/score',
            data: {
                token: wx.getStorageSync('token')
            },
            method: 'POST',
            success: (res) => {
                if (res.data.code == 200) {
                    let allScore = res.data.data
                    wx.setStorageSync('allScore', allScore)
                    for (let i = 1; i < 5; i++) {
                        if (res.data.data['大' + numberToChinese(i) + '上']) {
                            if (res.data.data['大' + numberToChinese(i) + '下']) { allScore['大' + numberToChinese(i) + '全年'] = res.data.data['大' + numberToChinese(i) + '上'].concat(res.data.data['大' + numberToChinese(i) + '下']) } else { allScore['大' + numberToChinese(i) + '全年'] = res.data.data['大' + numberToChinese(i) + '上'] }
                        }
                    }
                    self.setData({
                        score: allScore,
                        loading: null,
                        tolog:'none'
                    })
                    self.fill()
                } else{
                  wx.navigateTo({
                    url: '/pages/me/bind/bind'
                  })
                } 
            }
        })
    },
    handleSelectTerm(e) {
        let index = Number(e.detail.value)
        if (index < Object.keys(this.data.score).length) {
            this.setData({
                termValue: this.data.term[index]
            })
            this.fill()
        } else {
            wx.showModal({
                title: '提示',
                content: '没有当前学期成绩',
                showCancel: false
            })
        }
    },
    onShareAppMessage() {
        let scorePoint = this.data.scorePoint
        return {
            title: '我的绩点' + scorePoint + '，不服来比比？'
        }

    }
})


function numberToChinese(i) {
    if (i == 1) return '一'
    else if (i == 2) return '二'
    else if (i == 3) return '三'
    else if (i == 4) return '四'
    else return undefined
}