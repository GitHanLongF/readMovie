function convertToStarsArray(stars) {  //stars是从豆瓣获取的星星的字符串
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}

function http(url,callback) {
  var that = this;
  wx.request({
    url: url, //仅为示例，并非真实的接口地址
    data: {},
    method: "GET",
    header: {
      "Content-Type": "" // 默认值
    },
    success: function (res) {
      callback(res.data)
    },
  })
}
//演员的名字用“/”拼接起来
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + " / ";
  }
  return castsjoin.substring(0, castsjoin.length - 2);  //把最后的斜杠去掉
}
//演员信息
function convertToCastInfos(casts) {
  var castsArray = []
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : "",
      name: casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}

module.exports = {
  convertToStarsArray: convertToStarsArray,
  http:http,
  convertToCastInfos: convertToCastInfos,
  convertToCastString: convertToCastString
}