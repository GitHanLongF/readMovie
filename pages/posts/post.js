var postsData = require('../../data/posts-data.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    //页面初始化 options为页面跳转所带来的参数
    //方法1：
     this.setData({
      posts_key: postsData.postList
    })

    //方法2：
    // this.data.postList = postsData.posts_key
  },

  onPostTap: function (event) {
    //获取到postId currentTarget当前鼠标点击的对象 dataset所有自定义属性的集合
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },

  onSwiperTap:function(event){

    //target 指的是当前点击的组件（img）  currentTarget指的是s事件捕获的组件(swiper)
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  }

})