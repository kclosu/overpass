# overpass
Запрос данных из openstreetmap по тегу

```
var overpass = new Overpass().bbox([left,bottom,right,top]).filter({
  amenity: "military",
  landuse: "military",
  military: "*",
  amenity: "police",
  landuse: "police",
  police: "*",
  amenity: "ranger_station" 
}).run(function(r){ 
  
});
```
