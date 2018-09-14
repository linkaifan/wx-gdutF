// pages/me/about/about.js
Page({
    data:{
        swiperCurrent: 0,
        feedbackValue: '',
        feedbackShow: 'none',
        du:45
    },
    onLoad:function(){

    },
    handleShow(e) {
      if (this.data.swiperCurrent) {
            this.setData({
                feedbackShow: 'none',
                swiperCurrent: 0,
                du: 45
            })
        }
        else {
            this.setData({
                feedbackShow: 'block',
                swiperCurrent: 1,
                du: 135
            })
        }
    },
    handleFbInput(e) {
        this.setData({
            feedbackValue: e.detail.value
        })
    },
    handleSubmit() {
        let feedbackValue = this.data.feedbackValue,
        self = this
        
        if(feedbackValue.length > 3) {
            wx.request({
                url: 'https://wegdut.yoricklee.com/suggestion',
                method: 'POST',
                data: {
                    token: wx.getStorageSync('token'),
                    suggestion: self.data.feedbackValue
                },
                success: (res) => {
                    console.log(res)
                    wx.showModal({
                        title: '提示',
                        content: '感谢您的反馈！',
                        showCancel: false,
                        success: (res) => {
                            if(res.confirm) {
                                self.setData({
                                    feedbackValue: ''
                                })
                            }
                        }
                    })
                }
            })
            
        }
        else {
            wx.showModal({
                title: '提示',
                content: '请多于4个字！',
                showCancel: false
            })
        }
        
    }
})