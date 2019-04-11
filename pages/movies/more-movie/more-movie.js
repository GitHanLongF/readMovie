// pages/movies/more-movie/more-movie.js
var app = getApp();  //调用全局对象 
var util = require('../../../utils/util.js');
Page({
  data: {
    //把数据从onload传递到onready里面
    movies:{},
    navigateTitle:'',
    requestUrl:'',  
    totalCount:0,
    isEmpty: true,
  },
  onLoad: function (options) {
      var category = options.category;
      this.data.navigateTitle=category;
      var dataUrl="";
      switch (category) {
        case "正在热映":
          dataUrl = app.globalData.doubanBase +
            "/v2/movie/in_theaters";
          break;
        case "即将上映":
          dataUrl = app.globalData.doubanBase +
            "/v2/movie/coming_soon";
          break;
        case "豆瓣TOP250":
          dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
          break;
      }
      this.data.requestUrl = dataUrl;
      console.log(category);
      util.http(dataUrl, this.processDoubanData)
  },

  //下拉刷新增加20条信息
  onScrollLower: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading();
  },
  //上拉刷新
  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban){
      var movies = [];
      for (var idx in moviesDouban.subjects) {
        var subject = moviesDouban.subjects[idx];
        var title = subject.title
        if (title.length > 6) {
          title = title.substring(0, 6) + "...";
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
      var totalMovies = {}
      //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
      if (!this.data.isEmpty) {
        totalMovies = this.data.movies.concat(movies);
      }
      else {
        totalMovies = movies;
        this.data.isEmpty = false;
      }
      this.setData({
        movies: totalMovies
      });
    wx.hideNavigationBarLoading();
    this.data.totalCount += 20;
  },
  onReady: function(event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle,
      success:function(){

      }
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
})