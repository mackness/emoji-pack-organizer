var IOSASSETSV2 = {
  payload_id: function() {
      return Math.floor(Date.now() / 1000);
  },
  /*packs: [{
    _aliasAs: "assets",
    id: "fill",
    title: "fill",
    emojis: [{
      _filter: "emojis",
      id: "fill",
    keywords: {
      _value: function(val) {
        if (val) {
          return val.split(",");
        }
        else {
          return [];
        }
      }
    },
    pack: "fill",
    title: "fill",
    category: "fill",
    tracking: "fill",
    photo: {
      _aliasAs: "asset_url",
      _expand: {
        object: "photos",
        fields: function(obj, config) { 
          return obj['url'].replace(config.s3.url, config.cloudfront.url);
        }
      }
    },
    thumbnail: {
      _aliasAs: "thumbnail",
      _filter: "photo",
      _expand: {
        object: "photos",
        fields: function(obj, config) { 
          if (typeof config.cloudfront.url !== "undefined") {
            return config.cloudfront.url + obj['thumbnail'] 
          } else {
            return obj['thumbnail'];
          }
        }
      }
    },
    //tones: "fill",
    tones: [{
      _filter: {
        key: "tones"
      },
      emoji: {
        _aliasAs: "type",
        _value: function(val) {
          if (typeof val !== "undefined") {
            return "emoji";
          } else {
            return "";
          }
        }
      },
      id: "fill",
      tracking: "fill",
      thumbnail: {
        _aliasAs: "thumbnail",
        _filter: "photo",
        _expand: {
          object: "photos",
          fields: function(obj, config) { 
            if (typeof config.cloudfront.url !== "undefined") {
              return config.cloudfront.url + obj['thumbnail'] 
            } else {
              return obj['thumbnail'];
            }
          }
        }
      },
      photo: {
        _aliasAs: "asset_url",
        _expand: {
          object: "photos",
          fields: function(obj, config) { 
            if (typeof config.cloudfront.url !== "undefined") {
              return config.cloudfront.url + obj['thumbnail'] 
            } else {
              return obj['thumbnail'];
            }
          }
        }
      },
    }],
    type: "fill",
    position: "fill",
    isAndroid: "fill",
    isIOS: "fill"
    }]
  }]};*/
  emojis: [{
    _aliasAs: "assets",
    id: "fill",
    keywords: {
      _value: function(val) {
        if (val) {
          return val.split(",");
        }
        else {
          return [];
        }
      }
    },
    pack: "fill",
    title: "fill",
    category: "fill",
    tracking: "fill",
    photo: {
      _aliasAs: "asset_url",
      _expand: {
        object: "photos",
        fields: function(obj, config) { 
          return obj['url'].replace(config.s3.url, config.cloudfront.url);
        }
      }
    },
    thumbnail: {
      _aliasAs: "thumbnail",
      _filter: "photo",
      _expand: {
        object: "photos",
        fields: function(obj, config) { 
          if (typeof config.cloudfront.url !== "undefined") {
            return config.cloudfront.url + obj['thumbnail'] 
          } else {
            return obj['thumbnail'];
          }
        }
      }
    },
    //tones: "fill",
    tones: [{
      _filter: {
        key: "tones"
      },
      emoji: {
        _aliasAs: "type",
        _value: function(val) {
          if (typeof val !== "undefined") {
            return "emoji";
          } else {
            return "";
          }
        }
      },
      id: "fill",
      tracking: "fill",
      thumbnail: {
        _aliasAs: "thumbnail",
        _filter: "photo",
        _expand: {
          object: "photos",
          fields: function(obj, config) { 
            if (typeof config.cloudfront.url !== "undefined") {
              return config.cloudfront.url + obj['thumbnail'] 
            } else {
              return obj['thumbnail'];
            }
          }
        }
      },
      photo: {
        _aliasAs: "asset_url",
        _expand: {
          object: "photos",
          fields: function(obj, config) { 
          return obj['url'].replace(config.s3.url, config.cloudfront.url);
          }
        }
      },
    }],
    type: "fill",
    position: "fill",
    isAndroid: "fill",
    isIOS: "fill"
  }]
};

module.exports = IOSASSETSV2;