(function(){
  window.Overpass = function(options){
    options = options || {};
    var server = options.server || '//overpass-api.de/api/';

    var point2latlon = function(point){
      var latlon = point;
      if(Object.prototype.toString.call(point).slice(8, -1) === 'Object'){
        latlon = point.lat + ',' + point.lon;
      }
      if(Object.prototype.toString.call(point).slice(8, -1) === 'Array'){
        latlon = point[0] + ',' + point[1];
      }
      return latlon;
    }

    var query = function(){
      var q = this.bbox + this.around;
      var filters = this.filter;
      var body = '';
      if(filters){
        for(var tagname in filters){
          var s =  "node[%filter](" + q + ");\n\
          way[%filter](" + q + ");\n\
          relation[%filter](" + q + ");\n";
          body += s.split('%filter').join('"' + tagname + '"="' + filters[tagname] + '"' );
        }
      } else {
        body = 
         "node(" + q + ");\n\
          way(" + q + ");\n\
          relation(" + q + ");\n"
        ;
      }

      return "[out:json];\n\
      (\n"
        + body + 
      ");\n\
      out body;\n\
      >;\n\
      out skel qt;";
    };

    return {
      filter: function(filter){
        this.filter = filter;
        return this; 
      },
      bbox: function(bbox){
        if(!bbox) throw "Empty bbox not allowed";
        var bboxstring = bbox;
        if(Object.prototype.toString.call(bbox).slice(8, -1) === 'Array'){
          if(bbox.length == 2){
            bboxstring = point2latlon(bbox[0]) + ',' + point2latlon(bbox[1]);
          }
          if(bbox.length == 4){
            bboxstring = bbox.join(',');
          }
        }
        this.around = '';
        this.bbox = bboxstring;
        return this;
      },
      around: function(point, radius){
        var latlon = point2latlon(point);
        radius = radius || 20;
        this.around = 'around:' + radius + ',' + point; 
        this.bbox = '';
        return this;
      },
      run: function(callback){
        var data = query.call(this);
        var request = new XMLHttpRequest();
        request.open('POST', server + 'interpreter', true);
        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.onreadystatechange = (function () {
          if (request.readyState != 4 || request.status != 200) return; 
          var response = JSON.parse(request.responseText).elements;
          var only_width_tags = [];
          response.forEach(function(o){
            if(o.tags && Object.keys(o.tags).length){
              only_width_tags.push(o);
            }
          });
          this.response = only_width_tags;
          callback && callback.apply && callback.apply(this, only_width_tags);
        }).bind(this);
        request.send('data=' + data);
      },
      html: function(){
        if(!this.response) return '';
        var html = '<div>';
        this.response.forEach(function(o){
          html += '<ul class="unstyled">';
          for(var t in o.tags){
            html += '<li>' + t + '&nbsp;<strong>' + o.tags[t] + '</strong>' + '</li>';
          }
          o.lat && o.lon && (html += '<li>Координаты&nbsp;<strong>' + o.lat + ' , ' + o.lon + '</strong></li>');
          html += '</ul>';
        });
        html += '</div>'
        return html;
      }
    };
  }
})();