var map; //GOOGLE MAPS MAIN MAP



var NYULatLng = {lat: 40.7291, lng: -73.9965};
var polygons = {};


var heatmap;
var circles;
var stations;

var markerNYU;
var line = [0,0];
var districts = {
};

var boroughs = { 
    "QUEENS": {mis: 0, fel: 0 , vio: 0, nei: 0, eli:0 ,far: 0, mus: 0, art: 0},
    "STATEN ISLAND": {mis: 0, fel: 0 , vio: 0 , nei: 0, eli:0,far: 0, mus: 0, art: 0},
    "BRONX": {mis: 0, fel: 0 , vio: 0 , nei: 0, eli:0,far: 0, mus: 0, art: 0},
    "BROOKLYN": {mis: 0, fel: 0 , vio: 0 , nei: 0, eli:0,far: 0, mus: 0, art: 0},
    "MANHATTAN": {mis: 0, fel: 0 , vio: 0 , nei: 0, eli:0,far: 0, mus: 0, art: 0}
};


var nbhMarkers =[];

var curDisFeature = [0,0];
var cur = 1;


var safetyFile;
var distanceFile;
var affordFile;
var top3file;





//google maps districts shape

    
var url1 = "http://services5.arcgis.com/GfwWNkhOj9bNBqoJ/arcgis/rest/services/nycd/FeatureServer/0/query?where=1=1&outFields=*&outSR=4326&f=geojson";
//Neighborhood names and Geometries
var url2 = "https://data.cityofnewyork.us/api/views/xyye-rtrs/rows.json?accessType=DOWNLOAD";
// Affordability dataset
 var url3 = "https://data.cityofnewyork.us/api/views/hg8x-zxpr/rows.json?accessType=DOWNLOAD";
//Crimes base dataset
 var url4 = "https://data.cityofnewyork.us/resource/9s4h-37hy.json";
// Farmers markets
 var urlF = "https://data.cityofnewyork.us/api/views/j8gx-kc43/rows.json?accessType=DOWNLOAD";
//Museums
 var urlM = "https://data.cityofnewyork.us/api/views/fn6f-htvy/rows.json?accessType=DOWNLOAD";
//Art galleries 
var urlA = "https://data.cityofnewyork.us/api/views/43hw-uvdj/rows.json?accessType=DOWNLOAD";
//Stations Open.ny.gov API Catalog
var urlS = "https://data.ny.gov/resource/hvwh-qtfg.json"



function googleMapsInit(){
    

    //Initialize map
map = new google.maps.Map(document.getElementById('map'),
{

  zoom: 10.2,
  zoomControl: false,
  center: NYULatLng,
  disableDefaultUI: true,
  draggableCursor: "auto",
  draggingCursor: "auto",
//gestureHandling: "auto",
  //draggable: false,
  //keyboardShortcuts: false,
  mapTypeControl: false,
  fullscreenControl: false,
  minZoom: 9.8,
  //

  styles: [
      {
          "featureType" : "road.highway",
        "stylers": [
      { "visibility": "off" }
    ]
      },
      {

          "elementType" : "labels",
        "stylers": [
      { "visibility": "off" }
    ]
      },
       {
          "featureType" : "poi",
        "stylers": [
      { "visibility": "off" }
    ]
      }


      ,
       {
          "featureType" : "water",
        "stylers": [
      {         "color": "#242d44"}
    ]
      },{
          "stylers":[{"lightness" : 0}]

      }

      ]




});

map.addListener("dragend", function(e){
    
    var bounds =new google.maps.LatLngBounds();
    bounds.extend({lat: 40.955257705902326,lng:-74.33042458545913});
    bounds.extend({lat: 40.4776166188012,lng:-73.61653746811214});
    
    if(!bounds.contains(map.getCenter())) map.fitBounds(bounds); 
    
    
});


map.fitBounds(new google.maps.LatLngBounds({lat: 40.955257705902326,lng:-74.33042458545913}, {lat: 40.4776166188012,lng:-73.61653746811214}));

map.data.setStyle(function(feature){return 
({ 
fillOpacity: 0 , strokeWeight: 0, strokeOpacity: 0});});

markerNYU = new google.maps.Marker(
  {
    position:NYULatLng,
    map: map,
    title: 'NYU Stern School of Business',
    icon : {url:"https://material.io/tools/icons/static/icons/twotone-layers-24px.svg", scaledSize: new google.maps.Size(25,25)},
    clickable: false


  });




new google.maps.Marker({
    position:{lat:40.76615735869118,lng:-73.96818092963255}, 
    map: map, 
    opacity:0.8,
    icon:{fillOpacity:0,  strokeOpacity:0,path : google.maps.SymbolPath.CIRCLE},
    label:{color: "#000000", fontSize: "14px", text: "Manhattan"}});
new google.maps.Marker({
    position:{lat:40.87166930058006,lng:-73.85180931122443}, 
    map: map, 
    opacity:0.8,
    icon:{fillOpacity:0.5, strokeOpacity:0, path : google.maps.SymbolPath.CIRCLE},
    label:{color: "#000000", fontSize: "14px", text: "Bronx"}});
new google.maps.Marker({
    position:{lat:40.72502209241806,lng:-73.79397767857136}, 
    map: map, 
    opacity:0.8,
    icon:{fillOpacity:0, strokeOpacity:0, path : google.maps.SymbolPath.CIRCLE},
    label:{color: "#000000", fontSize: "14px", text: "Queens"}});
new google.maps.Marker({
    position:{lat:40.62438446043325,lng:-73.95943048469383}, 
    map: map, 
    opacity:0.8,
    icon:{fillOpacity:0,  strokeOpacity:0,path : google.maps.SymbolPath.CIRCLE},
    label:{color: "#000000", fontSize: "14px", text: "Brooklyn"}});
new google.maps.Marker({
    position:{lat:40.59621313006683,lng:-74.12521173469383}, 
    map: map, 
    opacity:0.8,
    icon:{fillOpacity:0, strokeOpacity:0, path : google.maps.SymbolPath.CIRCLE},
    label:{color: "#000000", fontSize: "14px", text: "Staten Island"}});


//label: {color: "#ccbbaa", fontSize: "18px", text: "NYU LOL"},



line[0] = new google.maps.Polyline({
path:[ NYULatLng,NYULatLng],
map:map,
strokeOpacity: 0.5,
strokeWeight: 2

});


line[1] = new google.maps.Polyline({
path:[ NYULatLng,NYULatLng],
map:map,
strokeOpacity: 0.5,
strokeWeight: 2

});

   map.data.addListener('click', function(e){if(e.feature!=curDisFeature[0] && e.feature!= curDisFeature[1]){
     map.data.overrideStyle(curDisFeature[cur], {strokeWeight: 0.3, strokeOpacity: 0, fillOpacity: 0.2});
     map.data.overrideStyle(e.feature, {strokeWeight: 2, fillOpacity: 0.5});
     line[cur].setPath([NYULatLng, e.feature.getProperty("Shape_Center")]);
     curDisFeature[cur] = e.feature;
     updateDistrict(e);
     
     if(curDisFeature[0].getId()!== 0 && curDisFeature[1].getId()!== 0) compareTable();
     cur= (cur+1)%2;
    


   }});
   
      map.data.addListener('mouseover', function(e){
    if(e.feature.getId() != curDisFeature[0].getId() && e.feature.getId() != curDisFeature[1].getId())  map.data.overrideStyle(e.feature, {strokeWeight: 0.3,  strokeOpacity: 0.7, fillOpacity: 0.3});

   });
   
         map.data.addListener('mouseout', function(e){
     if(e.feature.getId() != curDisFeature[0].getId() && e.feature.getId() != curDisFeature[1].getId()) map.data.overrideStyle(e.feature, {strokeWeight: 0.3,  strokeOpacity: 0, fillOpacity: 0.2});
     
   });

loadData();
styleMap();




}


function findDistrict(pos){
    var districts = nearest(pos);
    
    
    for(var i = 0; i<districts.length; i++){
        for(var x in polygons[districts[i].id]){
            if(google.maps.geometry.poly.
            containsLocation(new google.maps.LatLng(pos), polygons[districts[i].id][x])  ){
            
            return districts[i].id;
            
            }
        }
        
        
        
        
    }
    return 0;
}
function nearest(pos){
     var topnear = [];

  map.data.forEach(function(f){
    topnear.push({id: f.getId(), center: f.getProperty("Shape_Center")});
  });

  topnear.sort(function(a,b){

    return distanceToDistrict(a.center, pos) - distanceToDistrict(b.center, pos);


  });


    return topnear;


}
function distanceToDistrict(origin, district){
    return google.maps.geometry.spherical.computeDistanceBetween(
    new google.maps.LatLng(origin),
    new google.maps.LatLng(district));
}
function distanceToNYU(pos){
    return distanceToDistrict(NYULatLng, pos);



}
function boroughName(borocd){
  borocd = Math.floor(borocd/100);
  var color;
  switch(borocd) {

    case(1):

    color = 'Manhattan';
    break;
case(2):
color = 'Bronx';
break;
case(3):
color = 'Brooklyn';
break;
case(4):
color = 'Queens';
break;
case(5):
color = 'Staten Island';
break;
default:
color = '';
break;
  }

  return color.toUpperCase();


}
function toggleStations(){
    stations.forEach(function(T, i){ T.setVisible(!T.getVisible())});
}
function toggleMuseumsAndArt(){   
    circles.forEach(function(T, i){T.setVisible(!T.getVisible())});}
function toggleCrime(){heatmap.setMap(heatmap.getMap() ? null : map);}
function toggleNeighborhoods(){   
    for(var ind in nbhMarkers){ 
        nbhMarkers[ind].setVisible(!nbhMarkers[ind].getVisible());
    }}
    
function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}//extracted from ourcodeworld.com


function downloadDistance(){download("distance.csv", distanceFile)}
function downloadAfford(){download("affordability.csv", affordFile)}
function downloadSafety(){download("safety.csv", safetyFile)}
function downloadTop(){download("top3.csv", top3file)}
function compareTable(){
    var tableReference = $("#compareTable")[0];
    tableReference.innerHTML = "";
    var bor;
    var dtc;
    var row;
    var eli;
    var dis;
    var cri;
    var mus;
    var art;
    
    var head = tableReference.createTHead();
    

    
  var newRow;
  var place;
  var borough;
  var district;
  var distance;

    newRow = head.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    bor = newRow.insertCell(0);
    dtc = newRow.insertCell(1);
    eli = newRow.insertCell(2);
    dis = newRow.insertCell(3);
    cri = newRow.insertCell(4);
    mus = newRow.insertCell(5);
    art = newRow.insertCell(6);
    
    bor.innerHTML = "Borough";
    dtc.innerHTML = "District number";
eli.innerHTML = "Affordability (ELI)";
dis.innerHTML = "Distance (mts)";
cri.innerHTML = "Crimes";
mus.innerHTML = "N° of Museums";
art.innerHTML = "N° of Art galleries";
  for(var i = 0; i< curDisFeature.length; i++){

    newRow = tableReference.insertRow(tableReference.rows.length);
    
    newRow.classList.add("table"); 
    bor = newRow.insertCell(0);
    dtc = newRow.insertCell(1);
    eli = newRow.insertCell(2);
    dis = newRow.insertCell(3);
    cri = newRow.insertCell(4);
    mus = newRow.insertCell(5);
    art = newRow.insertCell(6);
      
     bor.innerHTML = boroughName(curDisFeature[i].getId());
    dtc.innerHTML = borocdToIndex(curDisFeature[i].getId());
    //
    eli.innerHTML = districts[borocdToIndex(curDisFeature[i].getId())]["ELI"]["max"];
    if(districts[borocdToIndex(curDisFeature[i].getId())]["ELI"]["max"] > districts[borocdToIndex(curDisFeature[(i+1)%2].getId())]["ELI"]["max"])
    eli.classList.add("table-success"); 
    else  
    
    eli.classList.add("table-danger"); ;
    
    dis.innerHTML = distanceToNYU(curDisFeature[i].getProperty("Shape_Center"));
    if(distanceToNYU(curDisFeature[i].getProperty("Shape_Center"))< distanceToNYU(curDisFeature[(i+1)%2].getProperty("Shape_Center")))
    dis.classList.add("table-success"); 
    else  
    dis.classList.add("table-danger"); ;
    
    
    cri.innerHTML = districts[borocdToIndex(curDisFeature[i].getId())]["CRIMES"]["cnt"];
    if(districts[borocdToIndex(curDisFeature[i].getId())]["CRIMES"]["cnt"] < districts[borocdToIndex(curDisFeature[(i+1)%2].getId())]["CRIMES"]["cnt"])
    cri.classList.add("table-success"); 
    else  
    cri.classList.add("table-danger"); ;
    
    
    
    mus.innerHTML = districts[borocdToIndex(curDisFeature[i].getId())]["SITES"]["mus"];
    if(districts[borocdToIndex(curDisFeature[i].getId())]["SITES"]["mus"]>districts[borocdToIndex(curDisFeature[(i+1)%2].getId())]["SITES"]["mus"])
    mus.classList.add("table-success"); 
    else  
    mus.classList.add("table-danger"); ;
    
    

    art.innerHTML = districts[borocdToIndex(curDisFeature[i].getId())]["SITES"]["art"];
    if(districts[borocdToIndex(curDisFeature[i].getId())]["SITES"]["art"] > districts[borocdToIndex(curDisFeature[(i+1)%2].getId())]["SITES"]["art"])
    art.classList.add("table-success"); 
    else  
    art.classList.add("table-danger"); ;
    
  }


 

    
    
}

function makeTops(){
        
        
        
        makeTop3(makeTopAfford(),makeTopSafety(),makeTopDistance());
        
}
function makeTopSafety(){



    
    
    
 var top10safety = [];
   var maxC= 0;
   var minC= 1000000;

 
  map.data.forEach(function(f){
    top10safety.push(
        {id: f.getId(), 
        units: districts[borocdToIndex(f.getId())]["CRIMES"]["cnt"]
        }
        );
    maxC = districts[borocdToIndex(f.getId())]["CRIMES"]["cnt"]>maxC ? districts[borocdToIndex(f.getId())]["CRIMES"]["cnt"]: maxC;
    minC = districts[borocdToIndex(f.getId())]["CRIMES"]["cnt"]<minC ? districts[borocdToIndex(f.getId())]["CRIMES"]["cnt"]: minC;
  });
  
  top10safety.sort(function(a,b){

    return a.units - b.units;


  });

  var tableReference =  $("#topTableC")[0];
  tableReference.innerHTML ="";
  var head = tableReference.createTHead();
  var newRow;
  var place;
  var borough;
  var district;
  var distance;

    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "n°" ;
    borough.innerHTML = "Borough";
    district.innerHTML = "District";
    distance.innerHTML = "Crimes reported";

    safetyFile = "Borough,District Code,Crimes\r\n";
  for(var i = 0; i< 10; i++){


    //map.data.overrideStyle(map.data.getFeatureById(top10near[i].id), {strokeWeight: 3, fillOpacity: 0.8 , fillColor: "purple"});
    
    
    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "<h4> " +(i+1).toString() +"</h4> " ;
    borough.innerHTML = boroughName(top10safety[i].id);
     safetyFile = safetyFile + boroughName(top10safety[i].id) + ",";
    district.innerHTML = top10safety[i].id%100;
     safetyFile = safetyFile + (top10safety[i].id%100) + ",";
    distance.innerHTML = top10safety[i].units;
    safetyFile = safetyFile + (top10safety[i].units) + "\r\n";
  }
  
  
return {max: maxC, min: minC, array: top10safety};






}
function makeTopAfford(){
    
    
    
 var top10afford = [];
    var maxA= 0;
   var minA= 1000000;

 
  map.data.forEach(function(f){
    top10afford.push({id: f.getId(), units: districts[borocdToIndex(f.getId())]["ELI"]["max"]});
    maxA = districts[borocdToIndex(f.getId())]["ELI"]["max"]>maxA ?districts[borocdToIndex(f.getId())]["ELI"]["max"] : maxA;
    minA = districts[borocdToIndex(f.getId())]["ELI"]["max"]<minA ? districts[borocdToIndex(f.getId())]["ELI"]["max"]: minA;
  });
  
  top10afford.sort(function(a,b){

    return b.units - a.units;


  });

  var tableReference =  $("#topTableA")[0];
  tableReference.innerHTML ="";
  var head = tableReference.createTHead();
  var newRow;
  var place;
  var borough;
  var district;
  var distance;

    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "n°" ;
    borough.innerHTML = "Borough";
    district.innerHTML = "District";
    distance.innerHTML = "ELI units";

affordFile = "Borough,District Code,ELI units\r\n";
  for(var i = 0; i< 10; i++){


    //map.data.overrideStyle(map.data.getFeatureById(top10near[i].id), {strokeWeight: 3, fillOpacity: 0.8 , fillColor: "purple"});
    
    
    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "<h4> " +(i+1).toString() +"</h4> " ;
    borough.innerHTML = boroughName(top10afford[i].id);
    affordFile = affordFile + boroughName(top10afford[i].id) + ",";
    district.innerHTML = top10afford[i].id%100;
    affordFile = affordFile + (top10afford[i].id) + ",";
    distance.innerHTML = top10afford[i].units;
    affordFile = affordFile + top10afford[i].units + "\r\n";
  }
  
return {max: maxA, min: minA, array: top10afford};




}
function makeTopDistance(){
 
 var top10near = [];
 
var maxD= 0;
  var minD= 10000000 ;
  map.data.forEach(function(f){
    top10near.push({id: f.getId(), center: distanceToNYU(f.getProperty("Shape_Center"))});
    maxD = distanceToNYU(f.getProperty("Shape_Center"))>maxD ? distanceToNYU(f.getProperty("Shape_Center")): maxD;
    minD = distanceToNYU(f.getProperty("Shape_Center"))<minD ? distanceToNYU(f.getProperty("Shape_Center")): minD;
    
  });
  top10near.sort(function(a,b){

    return (a.center) - (b.center);


  });

  var tableReference =  $("#topTableD")[0];
  tableReference.innerHTML ="";
  
  var head = tableReference.createTHead();
  var newRow;
  var place;
  var borough;
  var district;
  var distance;
  

    
    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "n°" ;
    borough.innerHTML = "Borough";
    district.innerHTML = "District";
    distance.innerHTML = "Distance";

distanceFile = "Borough,District Code, mts\n";
  for(var i = 0; i< 10; i++){


    //map.data.overrideStyle(map.data.getFeatureById(top10near[i].id), {strokeWeight: 3, fillOpacity: 0.8 , fillColor: "purple"});
    newRow = tableReference.insertRow(tableReference.rows.length);
    newRow.classList.add("table"); 
    place = newRow.insertCell(0);
    borough = newRow.insertCell(1);
    district = newRow.insertCell(2);
    distance = newRow.insertCell(3);
    place.innerHTML = "<h4> " +(i+1).toString() +"</h4> " ;
    borough.innerHTML = boroughName(top10near[i].id);
    distanceFile = distanceFile + boroughName(top10near[i].id) + ",";
    district.innerHTML = top10near[i].id%100;
    distanceFile = distanceFile + (top10near[i].id%100) + ",";
    distance.innerHTML = Math.round((top10near[i].center)*100) /100 + " mts";
    distanceFile = distanceFile + Math.round((top10near[i].center)*100)/100 + " mts" + "\n";
  }
  
  
  return {max: maxD, min: minD, array: top10near};




}


function makeTop3(aff, saf, dis){

    var globalTop = {} ;
    var topArray= [];
    var globalTopB = {} ;
    var globalTopC = {} ;
    for(var i in aff.array){
        globalTop[aff.array[i].id] = (aff.array[i].units - aff.min)/(aff.max- aff.min);
    }
    
    
    
    for(var i in saf.array){
        globalTop[saf.array[i].id] += 1 - ((saf.array[i].units - saf.min)/(saf.max-saf.min));
    }
    
    
        for(var i in dis.array){
        globalTop[dis.array[i].id] += 1- ((dis.array[i].center - dis.min)/(dis.max-dis.min));
    }
    
    
    for(var key in globalTop) topArray.push({id: key, value: globalTop[key]});
    
    
    topArray.sort(function(a,b){
        
        return b.value- a.value;
    });
    top3file = "";
    gold(topArray[0].id);
    silver(topArray[1].id);
    bronze(topArray[2].id);
    
    
    
        

    
}
function updateDistrict(e){

  //TO-DO
  
  if(cur == 0){
  var code = document.getElementById("districtCode");
  var borough = document.getElementById("Borough");
  var eli = document.getElementById("eli");
  var crimes = document.getElementById( "crimes");
  var distance = document.getElementById("distance");
      
code.innerHTML = "Community Board: " + borocdToIndex(e.feature.getId());
borough.innerHTML = "Borough: " + boroughName(e.feature.getId());
eli.innerHTML = "<p></h4>ELI maximum:</h4> " + districts[borocdToIndex(e.feature.getId())]["ELI"]["max"] + " units</p>" +"<p></h5>ELI average:</h5> " + parseInt(10000*districts[borocdToIndex(e.feature.getId())]["ELI"]["avg"])/10000+ " units</p>";

distance.innerHTML = "Distance to NYU(mts): " + parseInt(distanceToNYU(e.feature.getProperty("Shape_Center")));
crimes.innerHTML = "Crimes (date: 31/12/2015): " + districts[borocdToIndex(e.feature.getId())]["CRIMES"]["cnt"];
  }
  
  else if(cur == 1){
  var code = document.getElementById("districtCodeB");
  var borough = document.getElementById("BoroughB");
  var eli = document.getElementById("eliB");
  var crimes = document.getElementById( "crimesB");
  var distance = document.getElementById("distanceB");
      
code.innerHTML = "Community Board: " + borocdToIndex(e.feature.getId());
borough.innerHTML = "Borough: " + boroughName(e.feature.getId());
eli.innerHTML = "<p></h4>ELI max:</h4> " + districts[borocdToIndex(e.feature.getId())]["ELI"]["max"] + " units</p>" +"<p></h5>ELI average:</h5> " + 
parseInt(10000*districts[borocdToIndex(e.feature.getId())]["ELI"]["avg"])/10000 + " units</p>";

distance.innerHTML = "Distance to NYU(mts): " + parseInt(distanceToNYU(e.feature.getProperty("Shape_Center")));
crimes.innerHTML = "Crimes (date: 31/12/2015): " + districts[borocdToIndex(e.feature.getId())]["CRIMES"]["cnt"];
  }





}

function gold(borocd){
    
    var type = "gold";
    var index = borocdToIndex(borocd);
  
    
    var district = document.getElementById(type + "District");
    var borough = document.getElementById(type + "Borough");
    var safety = document.getElementById(type + "Safety");
    var afford = document.getElementById(type + "Afford");
    var distance = document.getElementById(type + "Distance");
    var museums = document.getElementById(type + "Museums");
    var art = document.getElementById(type + "Art");
    
    district.innerHTML = "#1. " +index;
    top3file+= "#1. " +index + ",";
     borough.innerHTML = boroughName(borocd);
     top3file+= boroughName(borocd) + ",";
     safety.innerHTML = "Crimes: "+ districts[index]["CRIMES"]["cnt"];
     top3file+=  "Crimes: "+ districts[index]["CRIMES"]["cnt"] + ",";
     afford.innerHTML = "Afford (ELI): "+districts[index]["ELI"]["max"];
     top3file+=  "Afford (ELI): "+districts[index]["ELI"]["max"]+ ",";
     distance.innerHTML = "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")));
     top3file+=   "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")))+ ",";
     
     museums.innerHTML = "N° of museums: "+districts[index]["SITES"]["mus"];
     top3file+=  "N° of museums: "+districts[index]["SITES"]["mus"]+ ",";
     art.innerHTML = "N° of art galleries: "+districts[index]["SITES"]["art"];
     top3file+=  "N° of art galleries: "+districts[index]["SITES"]["art"]+ "\r\n";
    
    
    
}
function silver(borocd){
    
    var type = "silver";
        var index = borocdToIndex(borocd);

    
    var district = document.getElementById(type + "District");
    var borough = document.getElementById(type + "Borough");
    var safety = document.getElementById(type + "Safety");
    var afford = document.getElementById(type + "Afford");
    var distance = document.getElementById(type + "Distance");
    var museums = document.getElementById(type + "Museums");
    var art = document.getElementById(type + "Art");
    
      district.innerHTML = "#2. " +index;
    top3file+= "#2. " +index + ",";
     borough.innerHTML = boroughName(borocd);
     top3file+= boroughName(borocd) + ",";
     safety.innerHTML = "Crimes: "+ districts[index]["CRIMES"]["cnt"];
     top3file+=  "Crimes: "+ districts[index]["CRIMES"]["cnt"] + ",";
     afford.innerHTML = "Afford (ELI): "+districts[index]["ELI"]["max"];
     top3file+=  "Afford (ELI): "+districts[index]["ELI"]["max"]+ ",";
     distance.innerHTML = "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")));
     top3file+=   "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")))+ ",";
     
     museums.innerHTML = "N° of museums: "+districts[index]["SITES"]["mus"];
     top3file+=  "N° of museums: "+districts[index]["SITES"]["mus"]+ ",";
     art.innerHTML = "N° of art galleries: "+districts[index]["SITES"]["art"];
     top3file+=  "N° of art galleries: "+districts[index]["SITES"]["art"]+ "\r\n";
    
}
function bronze(borocd){
    
        var type = "bronze";
       var index = borocdToIndex(borocd);

    
    var district = document.getElementById(type + "District");
    var borough = document.getElementById(type + "Borough");
    var safety = document.getElementById(type + "Safety");
    var afford = document.getElementById(type + "Afford");
    var distance = document.getElementById(type + "Distance");
    var museums = document.getElementById(type + "Museums");
    var art = document.getElementById(type + "Art");
    
       district.innerHTML = "#3. " +index;
    top3file+= "#3. " +index + ",";
     borough.innerHTML = boroughName(borocd);
     top3file+= boroughName(borocd) + ",";
     safety.innerHTML = "Crimes: "+ districts[index]["CRIMES"]["cnt"];
     top3file+=  "Crimes: "+ districts[index]["CRIMES"]["cnt"] + ",";
     afford.innerHTML = "Afford (ELI): "+districts[index]["ELI"]["max"];
     top3file+=  "Afford (ELI): "+districts[index]["ELI"]["max"]+ ",";
     distance.innerHTML = "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")));
     top3file+=   "Distance to NYU (mts): "+parseInt(distanceToNYU(map.data.getFeatureById(borocd).getProperty("Shape_Center")))+ ",";
     
     museums.innerHTML = "N° of museums: "+districts[index]["SITES"]["mus"];
     top3file+=  "N° of museums: "+districts[index]["SITES"]["mus"]+ ",";
     art.innerHTML = "N° of art galleries: "+districts[index]["SITES"]["art"];
     top3file+=  "N° of art galleries: "+districts[index]["SITES"]["art"]+ "\r\n";
    
}


function styleMap(){

  map.data.setStyle(function(feature){
    var code = Math.floor(feature.getProperty('BoroCD')/100);
var color;
     switch(code) {

case(1):

color = 'blue';
break;
case(2):
color = 'red';
break;
case(3):
color = 'green';
break;
case(4):
color = 'orange';
break;
case(5):
color = 'purple';
break;
default:
color = 'black';
break;
     }
     return ({fillColor: color , fillOpacity: 0.2 , strokeWeight: 0.3, strokeColor: "black", strokeOpacity: 0});
   }
 );

}
function borocdToIndex(boroCD){

var x = Math.floor(boroCD/100);


var code = ((boroCD -(x*100)) < 10) ? "0" + (boroCD -(x*100)).toString() : (boroCD -(x*100)).toString() ;
if ((boroCD -(x*100)) > 20) return "FA";
switch(x) {
case(1):
// 'Manhattan';
code = "MN-" + code;
break;
case(2):
// 'Bronx';
code = "BX-" + code;
break;
case(3):
// 'Brooklyn';
code = "BK-" + code ;
break;
case(4):
// 'Queens';
code = "QN-" + code;
break;
case(5):
// 'Staten Island';
code = "SI-" + code;
break;

  }

return code;
}
function indexToBoroCD(index){
var x = index.slice(0, 2);
var code = parseInt(index.slice(3,5));

switch(x) {
case("MN"):
// 'Manhattan';
code = 100 + code;
break;
case("BX"):
// 'Bronx';
code = 200 + code;
break;
case("BK"):
// 'Brooklyn';
code = 300 + code ;
break;
case("QN"):
// 'Queens';
code = 400 + code;
break;
case("SI"):
// 'Staten Island';
code = 500 + code;
break;

  }

return code;
}
function geoCenter(geom){

  var bounds = new google.maps.LatLngBounds();


    geom.forEachLatLng(function (pos) {
    bounds.extend(pos);

  });


return {lat: bounds.getCenter().lat(), lng:  bounds.getCenter().lng()};

}
function featureToPolygon(feature){


    var array =[];
    var innerArray =[];
        

        if(feature.geometry.type == "Polygon")
        {for(var o in feature.geometry.coordinates[0]){
            innerArray.push({"lng": feature.geometry.coordinates[0][o][0],"lat": feature.geometry.coordinates[0][o][1]});
        }

        array.push(new google.maps.Polygon({"paths" : innerArray}));

    }

    else {

        for(var i in feature.geometry.coordinates){
            innerArray =[];
            for(var o in feature.geometry.coordinates[i][0]){
            innerArray.push(
                {
        "lng": feature.geometry.coordinates[i][0][o][0]
        ,"lat": feature.geometry.coordinates[i][0][o][1]});
        }
        array.push(new google.maps.Polygon(
            {"paths" : innerArray}
            )
            );

        }

    }



    return array;


}
function polygonFromFeature(feature){

    var innerArray =[];
        innerArray =[];

        if(feature.geometry.type == "Polygon")
        {for(var o in feature.geometry.coordinates[0]){
            innerArray.push({"lng": feature.geometry.coordinates[0][o][0],"lat": feature.geometry.coordinates[0][o][1]});
        }

        new google.maps.Polygon(
            {"paths" : innerArray , map:map , clickable: false, fillColor: "#509050", fillOpacity: 1, strokeOpacity: 0}

            );

    }

    else {

        for(var i in feature.geometry.coordinates){
            innerArray =[];
            for(var o in feature.geometry.coordinates[i][0]){
            innerArray.push(
                {
        "lng": feature.geometry.coordinates[i][0][o][0]
        ,"lat": feature.geometry.coordinates[i][0][o][1]});
        }
        new google.maps.Polygon(
            {"paths" : innerArray , map:map , clickable: false, fillColor: "#509050", fillOpacity: 1, strokeOpacity: 0}


        );

        }

    }
}
function latlngFromPoint(message){

    message = message.substring(7,message.length-1);
    var splitted = message.split(" ");
    return {lng: parseFloat(splitted[0]), lat: parseFloat(splitted[1]) };



}
function loadData(){

  var data = $.get(url1,function(){} )
              .done(function(){


              var features = JSON.parse(data.responseText).features;
              
              for(var i in features){
              
                districts[ borocdToIndex(features[i].properties.BoroCD) ] =
                {
                
                "ELI": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "VLI": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "LI": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "MOI": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "MII": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "OTH": {"avg": 0, "cnt": 0, "max": 0}
                ,
                "CRIMES":{"cnt" : 0,  "mis": 0, "fel": 0, "vio":0}
                ,
                "SITES": { "mus": 0, "art": 0}
                    
                };
                
                
                if ((features[i].properties.BoroCD) %100 < 20) {
                    polygons[features[i].properties.BoroCD] =featureToPolygon(features[i]);
                    map.data.addGeoJson(features[i], {idPropertyName: 'BoroCD'} );
                } else polygonFromFeature(features[i]);
                
                
                
              }
              markerNYU.setAnimation(google.maps.Animation.DROP);

            //TEST AFTER CREATING FEATURES
             map.data.forEach( function(f){
               
               var fcenter = geoCenter( f.getGeometry() );
                f.setProperty("Shape_Center", fcenter);
                  //console.log(f.getId());
              });
curDisFeature[0] = new google.maps.Data.Feature({id:0});
curDisFeature[1] = new google.maps.Data.Feature({id:0});


            loadNeighborhoods();








              


              }
            )
              .fail(function(error){console.error(error)});

}
function loadAffordability(){
    
              var data =$.get(url3,function(){} )   .done(function(){

                var count = 0;
                var avg = 0;
                var input = 0;
                

                for(var i = 0; i<data.responseJSON.data.length; i++){
                    
                    if(data.responseJSON.data[i][19].length == 5){
                        //Extremely Low Income
                        affordDataFields(31, "ELI", data.responseJSON.data[i]);
                        affordDataFields(32, "VLI", data.responseJSON.data[i]);
                        affordDataFields(33, "LI", data.responseJSON.data[i]);
                        affordDataFields(34, "MOI", data.responseJSON.data[i]);
                        affordDataFields(35, "MII", data.responseJSON.data[i]);
                        affordDataFields(36, "OTH", data.responseJSON.data[i]);
                    
                        if(data.responseJSON.data[i][31] > 0) 
                        boroughs[data.responseJSON.data[i][15].toUpperCase()]["eli"]++;


                    }


                }
                
                
 

               loadCrimes();

    

          }
            )
              .fail(function(error){console.error(error)});

}
function affordDataFields(num, name, data){
    
               var count = districts[data[19]][name]["cnt"];
              var avg = districts[data[19]][name]["avg"];
               var input = parseInt(data[num]);

                  districts[data[19]][name]["max"] =
                  Math.max(data[num] , districts[data[19]][name]["max"]);

                  districts[data[19]][name]["avg"] =
                ((avg *count) + input) / (count + 1);
                
                 if (data[num] > 0) districts[data[19]][name]["cnt"]++;
    
}
function loadNeighborhoods(){
    
     var data = $.get(url2,function(){} ).done(
                  function(){
                        
                        
                      for(var i in data.responseJSON.data){


                          var temp = new google.maps.Marker(

                              {
                                  position: latlngFromPoint(data.responseJSON.data[i][9]),
                                  map: map,
                                  animation: google.maps.Animation.DROP,
                                   icon : {url:"https://material.io/tools/icons/static/icons/twotone-arrow_drop_up-24px.svg", scaledSize: new google.maps.Size(10,10)


                                    },
                                    draggable: false,
                                    //clickable: false,
                                    visible:false,
                                    
                                    title:data.responseJSON.data[i][10]
                              }
                             
                              
                              );
                          nbhMarkers.push(temp);
                          boroughs[data.responseJSON.data[i][16].toUpperCase()]["nei"]++;

                      }





                    loadMarkets();
                    loadAffordability();

                  }

                  ).fail(function(error){console.error(error)});


}
function loadMarkets(){
    
    
     var data = $.get(urlF,function(){} ).done(
                  function(){
                        
                      
                      for(var i in data.responseJSON.data){
              if(data.responseJSON.data[i][11] != null){            
                          boroughs[data.responseJSON.data[i][11].toUpperCase()].far++;}
        
                          
                          
                          
                          
                      }
                      
                    loadArt();     
                  }

                  ).fail(function(error){console.error(error)});



    
    
    
}
function loadMuseums(){
    
    
     var data = $.get(urlM,function(){} ).done(
                  function(){
                        
                      
                      
                      var dis, latlon;
                    for(var i in data.responseJSON.data){
                          
                          
                        latlon = latlngFromPoint(data.responseJSON.data[i][8]);
                        dis = findDistrict(latlon);
                      
                        if(dis!=0){
                            boroughs[boroughName(dis)].mus++;
                            dis = borocdToIndex(dis);
                            districts[dis]["SITES"]["mus"]++;
                           circles.push( new google.maps.Circle(
                                {
                                    map:map,
                                    center: latlon,
                                    fillColor: "#aaaa00",
                                    strokeOpacity: 0,
                                    fillOpacity: 0.5,
                                    radius: 250,
                                    strokeWeight:0.5
                                
                                    
                                }));
                        }
                          
                          
                      }
                      loadStations();
                        
                  }

                  ).fail(function(error){console.error(error)});



    
    
    
}
function loadArt(){
    
    circles = new google.maps.MVCArray();
     var data = $.get(urlA,function(){} ).done(
                  function(){
                        
                      
                      
                                            
                      var dis, latlon;
                    for(var i in data.responseJSON.data){
                          
                          
                        latlon = latlngFromPoint(data.responseJSON.data[i][9]);
                        dis = findDistrict(latlon);

                        if(dis!=0){
                            boroughs[boroughName(dis)].art++;
                            dis = borocdToIndex(dis);
                            districts[dis]["SITES"]["art"]++;
                      circles.push(new google.maps.Circle(
                                {
                                    map:map,
                                    center: latlon,
                                    fillColor: "#00aaaa",
                                    strokeOpacity: 0,
                                    fillOpacity: 0.5,
                                    radius: 250,
                                    strokeWeight:0.5
                                    
                                }));
                        }
                          
                          
                      }
                      loadMuseums();
                        
                  }

                  ).fail(function(error){console.error(error)});



    
    
    
}
function loadStations(){
    
    $.ajax({
        url: urlS,
        type: "GET",
        data:{
            
            "$$app_token":"0Xi32T4rDxwPtWVvCO5p1vlf0",
            "$group": "station_name", 
            "$select": "station_name, max(station_latitude), max(station_longitude)"
            
        }
    
        
    }).done(function(data){
        
        //https://material.io/tools/icons/static/icons/twotone-directions_bus-24px.svg
        
        stations = new google.maps.MVCArray();
        
        for(var i in data){
            
            
            stations.push( new google.maps.Marker({
                
                
                icon: {url:"https://material.io/tools/icons/static/icons/twotone-directions_bus-24px.svg", scaledSize: new google.maps.Size(7,7)},
                title: data[i]["station_name"],
                position: {lat : parseFloat(data[i]["max_station_latitude"]), lng: parseFloat(data[i]["max_station_longitude"])}
                ,
                map:map,
                visible:false
            }));
            
        }
        makeTops();
        
        
        
        
    });
    
}
function loadCrimes(){
    
    $.ajax({
        url: url4,
        type: "GET",
        data:{
            
            "$$app_token":"0Xi32T4rDxwPtWVvCO5p1vlf0",
            "$where": "lat_lon IS NOT NULL AND cmplnt_fr_dt between \'2015-12-31T00:00:00.000\' and \'2015-12-31T00:00:00.000\'"
            ,
            "$select": "latitude,longitude, ofns_desc, law_cat_cd, boro_nm"
            
            
        }
    
        
    }).done(function(data){
        
        
        
        var points = new google.maps.MVCArray();
        for(var i in data){
            var type = "";
            
            switch(data[i]["law_cat_cd"]){
                
                case("FELONY"):
                    type = "fel";
                    break;
                    
                case("MISDEMEANOR"):
                    type = "mis";
                    break;
                    
                case("VIOLATION"):
                    type = "vio";
                    break;
                    
                    
            }
            
            boroughs[data[i]["boro_nm"]][type]++;
            
            var dis = findDistrict({lat : parseFloat(data[i]["latitude"]),lng: parseFloat( data[i]["longitude"])});
            
            
            
            dis = borocdToIndex(dis);
            
            
            if(dis != 0){ 
                
                districts[dis]["CRIMES"][type]++;
            districts[dis]["CRIMES"]["cnt"]++;
            
            points.push( new google.maps.LatLng(parseFloat(data[i]["latitude"]),parseFloat( data[i]["longitude"])));
            
                }

            
            
            
            
        }
        
        
        
        
           heatmap = new google.maps.visualization.HeatmapLayer(
                  {
                      data: points,
                      map: null,
                      gradient: [
          'rgba(0, 255, 255, 0)',
          'rgba(0, 255, 255, 1)',
          'rgba(0, 191, 255, 1)',
          'rgba(0, 127, 255, 1)',
          'rgba(0, 63, 255, 1)',
          'rgba(0, 0, 255, 1)',
          'rgba(0, 0, 223, 1)',
          'rgba(0, 0, 191, 1)',
          'rgba(0, 0, 159, 1)',
          'rgba(0, 0, 127, 1)',
          'rgba(63, 0, 91, 1)',
          'rgba(127, 0, 63, 1)',
          'rgba(191, 0, 31, 1)',
          'rgba(255, 0, 0, 1)'
        ],
        
                  }
                 
                  
                  );
        
    });
    
    
    
}







$(document).ready( function(){
    var data =
    {
        labels:["QUEENS"
,
"STATEN ISLAND"
,
"BRONX"
,
"BROOKLYN"
,
"MANHATTAN"],
        series:[
            {
            label: 'Misdemeanor',
            values:[108,35,110,146,108]
        },{
        label: 'Felony',
        values:[70,15,82,113,83]
        },{
         label: 'Violation',
        values:[30,11,32,32,25]
        }]
    };

var chartWidth       = 300,
    barHeight        = 20,
    groupHeight      = barHeight * data.series.length,
    gapBetweenGroups = 10,
    spaceForLabels   = 150,
    spaceForLegend   = 150;

// Zip the series data together (first values, second values, etc.)
var zippedData = [];
for (var i=0; i<data.labels.length; i++) {
  for (var j=0; j<data.series.length; j++) {
    zippedData.push(data.series[j].values[i]);
  }
}

// Color scale
var color = d3.scale.category20();
var chartHeight = barHeight * zippedData.length + gapBetweenGroups * data.labels.length;

var x = d3.scale.linear()
    .domain([0, d3.max(zippedData)])
    .range([0, chartWidth]);

var y = d3.scale.linear()
    .range([chartHeight + gapBetweenGroups, 0]);

var yAxis = d3.svg.axis()
    .scale(y)
    .tickFormat('')
    .tickSize(0)
    .orient("left");

// Specify the chart area and dimensions
var chart = d3.select(".chart")
    .attr("width", spaceForLabels + chartWidth + spaceForLegend)
    .attr("height", chartHeight);

// Create bars
var bar = chart.selectAll("g")
    .data(zippedData)
    .enter().append("g")
    .attr("transform", function(d, i) {
      return "translate(" + spaceForLabels + "," + (i * barHeight + gapBetweenGroups * (0.5 + Math.floor(i/data.series.length))) + ")";
    });

// Create rectangles of the correct width
bar.append("rect")
    .attr("fill", function(d,i) { return color(i % data.series.length); })
    .attr("class", "bar")
    .attr("width", x)
    .attr("height", barHeight - 1);

// Add text label in bar
bar.append("text")
    .attr("x", function(d) { return x(d) - 3; })
    .attr("y", barHeight / 2)
    .attr("fill", "red")
    .attr("dy", ".35em")
    .text(function(d) { return d; });

// Draw labels
bar.append("text")
    .attr("class", "label")
    .attr("x", function(d) { return - 10; })
    .attr("y", groupHeight / 2)
    .attr("dy", ".35em")
    .text(function(d,i) {
      if (i % data.series.length === 0)
        return data.labels[Math.floor(i/data.series.length)];
      else
        return ""});

chart.append("g")
      .attr("class", "y axis")
      .attr("transform", "translate(" + spaceForLabels + ", " + -gapBetweenGroups/2 + ")")
      .call(yAxis);

// Draw legend
var legendRectSize = 18,
    legendSpacing  = 4;

var legend = chart.selectAll('.legend')
    .data(data.series)
    .enter()
    .append('g')
    .attr('transform', function (d, i) {
        var height = legendRectSize + legendSpacing;
        var offset = -gapBetweenGroups/2;
        var horz = spaceForLabels + chartWidth + 40 - legendRectSize;
        var vert = i * height - offset;
        return 'translate(' + horz + ',' + vert + ')';
    });

legend.append('rect')
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style('fill', function (d, i) { return color(i); })
    .style('stroke', function (d, i) { return color(i); });

legend.append('text')
    .attr('class', 'legend')
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function (d) { return d.label; });
  $("#distanceTable").on("click", downloadTop);


})
