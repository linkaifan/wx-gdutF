Page({
    data:{
        searchValue: null,
        inputShowed: false,
        bookList: null,
        searchList: [],
        loading: null,
        url:"",
        display:"none",
        _name:null,
        _Author:null
    },
    onLoad:function() {
      let self = this;
        this.setData({
            inputShowed: true
        });
        wx.setNavigationBarTitle({
            title: '图书馆藏'
        })
        wx.request({ 
          method: 'GET',
          url: 'https://wegdut.yoricklee.com/gdutlibrary/hotsearch',
          success: (res) => {
            var searchlist=new Array();
            let hot=res.data.stvisitkey_ifa_GetList_list1
            for(let i=0;i<hot.length;i++){
              if (hot[i].Keys!="null"){
              searchlist.push(hot[i].Keys)}
            }
            self.setData({
              searchList: searchlist,
                loading: null
              })
          }
        })  
    },
    search:function(e) {
        var self = this
        self.setData({
            searchList: [],
            loading: 'loading'
        })
        //self.data.searchValue = e.detail.value.input
        wx.request({
            method: 'GET',
            url: 'https://wegdut.yoricklee.com/gdutlibrary/list',
            data: {
              keyword: self.data.searchValue
            },
            success:(res) => {
              let contect = res.data.data.find_ifa_FindFullPage_list1
              let name = res.data.data.find_ifa_FindFullPage_list1
              let _Author=new Array
              if (contect==''){
                self.setData({
                  bookList: null,
                  display: "block",
                  url:"../../../assets/icon/undefined.png", 
                  loading: null,            
                     }) 
              }else{
                for (let i = 0; i < contect.length; i++){          
                  if (contect[i].Title.length > 30){
                    contect[i].Title=name[i].Title.slice(0, 30)
                    }
                    else {
                    contect[i].Title=name[i].Title
                    }
                  }
                self.setData({
                  url: null,
                  display: "none",
                  url: "",
                  loading: null,
                  bookList: contect,
                })
              }
            }
        })
    },
    handleShowInput() {
        this.setData({
            inputShowed: true
        });
    },
    handleSearch(e){
      var self = this
      self.data.searchValue = e.detail.value.input
      this.search()
    },
    handleSelectHot(e) {
      this.setData({
        searchValue: e.currentTarget.dataset.index
      })
      this.search()
    },
    handleClearInput() {
        this.setData({
            searchValue: "",
        });
    },
    handleBookEntry(e) {
        wx.navigateTo({
            url: '/pages/me/library/book/book?CtrlRd=' + e.currentTarget.dataset.ctrlrd + '&title=' + e.currentTarget.dataset.title + '&CtrlNo=' + e.currentTarget.dataset.ctrlno
        })
    },
    toMyBorrow(){
      wx.navigateTo({
        url: '/pages/me/library/borrow/borrow',
      })
    }
})