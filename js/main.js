// Leaflet map setup
var map = L.map('map', {
  center: [39.956, -75.211],
  zoom: 14
});


var CartoDB_DarkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);
$('.sidebar').hide();
$('.sidebar2').hide();
$('.sidebar3').hide();
$('#legend1').hide();
$('#legend2').hide();
$('#legend3').hide();


var layerUrl = 'https://yixu0215.cartodb.com/api/v2/viz/4ef72dbe-12f1-11e6-99c8-0ecfd53eb7d3/viz.json';
var layer1;
var layers;
var sql;
var markers=[];
var marker;
var opts;

var MRCSS = [
  '#zillow_acs_westphilly_1{',
  'marker-fill-opacity: 0.8;',
  'marker-line-color: #FFF;',
  'marker-line-width: 1;',
  'marker-line-opacity: 1;',
  'marker-width: 10;',
  'marker-fill: #FFFFB2;',
  'marker-allow-overlap: true;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 938] {',
   'marker-fill: #B10026;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 815] {',
   'marker-fill: #E31A1C;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 704] {',
   'marker-fill: #FC4E2A;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 666] {',
   'marker-fill: #FD8D3C;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 624] {',
   'marker-fill: #FEB24C;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 574] {',
   'marker-fill: #FED976;',
'}',
'#zillow_acs_westphilly_1 [ med_rent <= 525] {',
   'marker-fill: #FFFFB2;',
'}'
].join('\n');

var MVCSS = [
  '#zillow_acs_westphilly_1{',
  'marker-fill-opacity: 0.8;',
  'marker-line-color: #FFF;',
  'marker-line-width: 1;',
  'marker-line-opacity: 1;',
  'marker-width: 10;',
  'marker-fill: #FFFFCC;',
  'marker-allow-overlap: true;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 174452] {',
   'marker-fill: #0C2C84;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 62451] {',
   'marker-fill: #225EA8;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 31107] {',
   'marker-fill: #1D91C0;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 14554] {',
   'marker-fill: #41B6C4;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 10373] {',
   'marker-fill: #7FCDBB;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 8602] {',
   'marker-fill: #C7E9B4;',
'}',
'#zillow_acs_westphilly_1 [ med_val <= 6836] {',
   'marker-fill: #FFFFCC;',
'}'
].join('\n');

var PWCSS = [
  '#zillow_acs_westphilly_1{',
  'marker-fill-opacity: 0.8;',
  'marker-line-color: #FFF;',
  'marker-line-width: 1;',
  'marker-line-opacity: 1;',
  'marker-width: 10;',
  'marker-fill: #1a9850;',
  'marker-allow-overlap: true;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 64.77312089] {',
   'marker-fill: #d73027;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 51.42107564] {',
   'marker-fill: #f79272;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 15.44028951] {',
   'marker-fill: #fed6b0;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 5.817480011] {',
   'marker-fill: #fff2cc;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 3.114318268] {',
   'marker-fill: #d2ecb4;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 1.607501674] {',
   'marker-fill: #8cce8a;',
'}',
'#zillow_acs_westphilly_1 [ pct_white <= 0.592690155] {',
   'marker-fill: #1a9850;',
'}'
].join('\n');

$('#dropdownMenu1').click(function(){
  if(markers){
      _.each(markers,function(layer){
        map.removeLayer(layer);
      });
  }
  $('.sidebar2').show();
  $('.sidebar3').show();
  $('.sidebar').hide();
});

$('#dropdownMenu2').click(function(){
  if(layers){
    map.removeLayer(layers);
  }
  $('.sidebar').show();
  $('.sidebar3').hide();
  $('.sidebar2').hide();
  $('#legend1').hide();
  $('#legend2').hide();
  $('#legend3').hide();
});

$('#b1').click(function(){
  $('.sidebar3').empty();
  $('.sidebar2').hide();
  $('#legend2').hide();
  $('#legend3').hide();
  if(layers){
    map.removeLayer(layers);
  }
  opts = {
            type: 'cartodb',
            user_name: "yixu0215",
             sublayers: [{
                sql: "SELECT * FROM zillow_acs_westphilly_1 ", // Required
                cartocss:  MRCSS,
                interactivity: 'med_rent'
            }]
          };
          cartodb.createLayer(map,opts)
              .addTo(map)
              .on('done', function(layer) {
                layers = layer;
                var sublayer = layer.getSubLayer(0);
                sublayer.setInteraction(true);
                sublayer.on("featureOver", function(e,latlng,pos,data,layerIndex){
                  var mr = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
                  .text('Median Rent: '+data.med_rent+'');
                  $('.sidebar3').empty();
                  $('.sidebar3').append(mr);
                });
              });
  $('#legend1').show();
});

$('#b2').click(function(){
  $('.sidebar3').empty();
  $('#legend1').hide();
  $('#legend3').hide();
  $('.sidebar2').hide();
  if(layers){
    map.removeLayer(layers);
  }
  opts = {
            type: 'cartodb',
            user_name: "yixu0215",
             sublayers: [{
                sql: "SELECT * FROM zillow_acs_westphilly_1 ", // Required
                cartocss:  MVCSS,
                interactivity: 'med_val'
            }]
          };
          cartodb.createLayer(map,opts)
              .addTo(map)
              .on('done', function(layer) {
                layers = layer;
                var sublayer = layer.getSubLayer(0);
                sublayer.setInteraction(true);
                sublayer.on("featureOver", function(e,latlng,pos,data,layerIndex){
                  var mv = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
                  .text('Median Value: '+data.med_val+'');
                  $('.sidebar3').empty();
                  $('.sidebar3').append(mv);
                });
              });
  $('#legend2').show();
});

$('#b3').click(function(){
  $('.sidebar3').empty();
  $('#legend1').hide();
  $('#legend2').hide();
  $('.sidebar2').hide();
  if(layers){
    map.removeLayer(layers);
  }
  opts = {
            type: 'cartodb',
            user_name: "yixu0215",
             sublayers: [{
                sql: "SELECT * FROM zillow_acs_westphilly_1 ", // Required
                cartocss:  PWCSS,
                interactivity: 'pct_white'
            }]
          };
          cartodb.createLayer(map,opts)
              .addTo(map)
              .on('done', function(layer) {
                layers = layer;
                var sublayer = layer.getSubLayer(0);
                sublayer.setInteraction(true);
                sublayer.on("featureOver", function(e,latlng,pos,data,layerIndex){
                  var pw = $('<p style="padding:0px 20px 20px 20px;background-color:rgba(10,10,10,0.7);color:white;font-size:20px">')
                  .text('Percent White: '+data.pct_white+'');
                  $('.sidebar3').empty();
                  $('.sidebar3').append(pw);
                });
              });
  $('#legend3').show();
});

$('#button1').click(function(){
  if(layer1){
    map.removeLayer(layer1);
  }
  $('.sidebar').hide();
  var n1 = $('#numeric-input1').val();
  var n2 = $('#numeric-input2').val();
  var n3 = $('#numeric-input3').val();
  console.log(n1,n2);
  if(n1||n2){
    sql = "SELECT * FROM zillow_acs_westphilly_1 WHERE (lotsqft >= "+n1+" AND lotsqft < "+n2+") ORDER BY profits DESC LIMIT "+n3+""; // Required
  }
  else{
    sql = "SELECT * FROM zillow_acs_westphilly_1 ORDER BY profits DESC LIMIT "+n3+"";
  }
  $.ajax('https://yixu0215.cartodb.com/api/v2/sql/?q=' + sql).done(function(results) {
    draw(results);
  });
});

function draw(results){
  if(markers){
      _.each(markers,function(layer){
        map.removeLayer(layer);
      });
  }
  _.each(results.rows,function(rec){
    var list = "<dl><dt>Location</dt>"+
      "<dd>" + rec.street + "</dd>" +
      "<dt>Lot Size (sqft)</dt>" +
      "<dd>" + rec.lotsqft + "</dd>" +
      "<dt>Predicted Sales ($)</dt>" +
      "<dd>" + rec.predicted_sales + "</dd>" +
      "<dt>Value ($)</dt>" +
      "<dd>" + rec.value + "</dd>" +
      "<dt>Profits ($)</dt>" +
      "<dd>" + rec.profits*1000 + "</dd>" +
      "<dt>Link</dt>" +
      "<a href="+rec.link+">View on Zillow</a>";
    marker = L.circleMarker([rec.lat,rec.lon])
              .setStyle({fillColor: '#82b600',stroke:0,fillOpacity:1})
              .setRadius(10)
              .bindPopup(list)
              .addTo(map);
    markers.push(marker);
  });
}
