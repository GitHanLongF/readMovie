var postsData = require('../../../data/posts-data.js') //获取到data里面的数据
var app = getApp()  //获取全局app变量 
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlayingMusic:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    // var globalData = app.globalData;
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId]
    //如果在onLoad方法中不是异步的去执行一个数据绑定 则不需要使用this.setData方法 只需要对this.data赋值即可实现数据绑定
    this.setData({
      postData: postData
    })
   
    var postsCollected = wx.getStorageSync('posts_collected')
    if (postsCollected) {
      var postCollected = postsCollected[postId]
      this.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync('posts_collected', postsCollected);
    }
    
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId === postId){
      this.setData({
        isPlayingMusic:true
      })
    }
    this.setAudioMoniter();

  },

  setAudioMoniter:function(){
    var that = this;
    //音乐播放
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true
      })
      app.globalData.g_isPlayingMusic=true
      app.globalData.g_currentMusicPostId = that.data.currentPostId
    })
    //音乐停止
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false
      app.globalData.g_currentMusicPostId =null
    })
    //音乐停止后图标按钮自动切换成未播放状态
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false
      })
      app.globalData.g_isPlayingMusic = false;
      // app.globalData.g_currentMusicPostId = null;
    });
  },

  onColletionTap:function(event){
    var postsCollected = wx.getStorageSync('posts_collected');
    //获取文章的id
    var postCollected = postsCollected[this.data.currentPostId];
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否的缓存值
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定变量，从而实现图片切换
    this.setData({
      collected: postCollected
    })
    wx.showToast({
      title: postCollected?'收藏成功':'取消收藏', //提示框
      duration:1000, //悬停的时间
      icon:"success"  //默认是success
    })
  },

  onShareTap:function(event){
    var listItem = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博"
    ]
    wx.showActionSheet({
      itemList: listItem,
      itemColor: "#405f80",
      success:function(res){
         //res.cancel 用户是不是点击了取消按钮
         //res.capIndex 数据元素序号,从0开始
        wx.showModal({
          title: "用户 ",
          content: "用户是否取消？" + res.cancel + "现在无法实现分享功能，什么时候能支持呢"
        })

      }
    })
  },

  onMusicTap:function(event){
    var currentPostId = this.data.currentPostId;
    var postData = postsData.postList[currentPostId];
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic){
      wx.pauseBackgroundAudio();
      this.setData({
        isPlayingMusic: false
      })
    }else{
      wx.playBackgroundAudio({
        dataUrl: postData.music.url,
        title: postData.music.title,
        coverImgUrl: postData.music.coverImg,
      });
     this.setData({
        isPlayingMusic: true
      })
    }
    
  }
})