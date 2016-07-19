var IOSV2 = {
    payload_id: function() {
        return Math.floor(Date.now() / 1000);
    },
    title: "fill",
    additionalIOSJSON: {
      _aliasAs: "configurations",
      _value: function(val) {
        return JSON.parse(val);
      }
    },
    categories: [{
      _exclude_filter: function(thisObj) {
        if (thisObj['title'] == 'Recents') {
          return true;
        }
        return false;
      },
      id: "fill",
      title: "fill",
      photo: {
        _aliasAs: "imageURL",
        _expand: {
          object: "photos",
          fields: function(obj) { return obj['url'] }
        }
      },
      position: "fill"
    }],
    types: [{
      _exclude_filter: function(thisObj) {
        if (thisObj['title'] == 'Recents' || thisObj['title'] == 'Purchases') {
          return true;
        }
        return false;
      },
      id: "fill",
      type: "fill",
      title: "fill",
      photo: {
        _aliasAs: "imageURL",
        _expand: {
          object: "photos",
          fields: function(obj) { return obj['url'] }
        }
      },
      position: "fill",
      isIOS: "fill",
      isAndroid: "fill",
      display: function(val, fillConf, thisObj) {
        if (thisObj['title'] == 'Emoji') {
          return {size: {width: 50, height: 50}, "rows": 3};
        } else if (thisObj['title'] == 'Sticker') {
          return {size: {width: 100, height: 100}, "rows": 2};
        } else {
          return {size: {width: 0, height: 0}, "rows": 3};
        }
      }
    }],
    asset_json_url: function() { return "http://d3q6cnmfgq77qf.cloudfront.net/keyboards/kimoji/testing/v2/assets_ios.json" },
    packs: [{
      _exclude_filter: function(thisObj) {
        if (thisObj['published']) {
          return false;
        } 
        return true;
      },
      id: "fill",
      payloadId: {
        _aliasAs: "payload_id",
        _value: "fill"
      },
      photo: {
        _aliasAs: "asset_url",
        _expand: {
          object: "photos",
          /*fields: {
            url: "fill",
          }*/
          fields: function(obj) { return obj['url'] }
        }
      },
      iOSBundleIdentifer: {
        _aliasAs: "bundleIdentifer",
        _value: "fill"
      },
      title: "fill",
      price: "fill",
      description: "fill",
      json_url: "fill",
      position: "fill"
    }]
  };

module.exports = IOSV2;