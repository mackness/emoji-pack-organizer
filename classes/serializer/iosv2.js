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
      id: "fill",
      title: "fill",
      photo: {
        _aliasAs: "imageURL",
        _expand: {
          object: "photos",
          fields: function(obj) { return obj['url'] }
        }
      },
    }],
    types: [{
      type: "fill",
      title: "fill",
      photo: {
        _aliasAs: "imageURL",
        _expand: {
          object: "photos",
          fields: function(obj) { return obj['url'] }
        }
      },
    }],
    asset_json_url: function() { return "http://d3q6cnmfgq77qf.cloudfront.net/keyboards/kimoji/testing/v2/assets_ios.json" },
    packs: [{
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