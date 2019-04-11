var util = require('../../utils/util.js');
var app = getApp();  //调用全局对象 
Page({
    //RESFUl API JSON //经常用
    //SOAP XML  //很少用
    //粒度 不是 力度
    data:{
      inTheaters:{},
      comingSoon: {},
      top250: {},
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
    },
    onLoad:function(event){
      var that = this;
      var inTheatersUrl = app.globalData.doubanBase+
      "/v2/movie/in_theaters"+"?start=0&count=3"; //正在热映
      var comingSoonUrl = app.globalData.doubanBase + 
      "/v2/movie/coming_soon" + "?start=0&count=3"; //即将上映
      var top250Url = app.globalData.doubanBase + 
      "/v2/movie/top250" + "?start=0&count=3"; //top250;
      
      this.getMovieListData(inTheatersUrl,"inTheaters","正在热映");
      this.getMovieListData(comingSoonUrl, "comingSoon","即将上映");
      this.getMovieListData(comingSoonUrl, "top250", "豆瓣TOP250");
    },
  //跳转到更多电影页面
  onMoreTap:function(event){
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  //跳转到电影详情页
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id=' + movieId  //获取movieId
    })
  },
  //搜索框失去焦点事件
  onBindFocus:function(event){
    this.setData({
      containerShow:false,
      searchPanelShow:true
    })
  },
  //点击X号电影页面显示 搜索页面消失
  onCancelImgTap:function(event){
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult:{},
    })
  },
  //输入框失去焦点出发的事件
  onBindChange: function (event) {
   var text=event.detail.value; //获取到搜索框的搜索值
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text; //获取豆瓣的搜索电影地址
    this.getMovieListData(searchUrl, "searchResult", "");
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      header: {
        "Content-Type": "json"
      },
      success: function (res) {
        that.processDoubanData(res.data, settedKey, categoryTitle)
      },
      fail: function (error) {
        // fail
        console.log(error)
      }
    })
  },
  
  processDoubanData: function (moviesDouban, settedKey, catetoryTitle){
      var movies=[];
      for(var idx in moviesDouban.subjects){
        var subject = moviesDouban.subjects[idx];
        var title = subject.title
        if(title.length > 6){
          title = title.substring(0,6)+"...";
        }

        //[1,1,1,1,1] [1,1,1,1,0]
        var temp = {
          stars: util.convertToStarsArray(subject.rating.stars), //获取到星星数组
          title: title,
          average: subject.rating.average,
          coverage: subject.images.large,
          movieId: subject.id,
        }
        movies.push(temp)
      }
      var readyData ={};
      readyData[settedKey] = {
        catetoryTitle: catetoryTitle,
        movies:movies
      };
      this.setData(readyData)
    }
})