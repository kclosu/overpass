```
var overpass = new Overpass().around([lat, lng]).run(function(r){ 
  $(this.html()).appendTo('#latlngs')
  .css('margin-bottom', '1em');
});
```
```
var overpass = new Overpass().bbox([left,bottom,right,top]).run(function(r){ 
  $(this.html()).appendTo('#latlngs')
  .css('margin-bottom', '1em');
});
```