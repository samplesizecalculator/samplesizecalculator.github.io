google.charts.load('current', {packages: ['corechart', 'line']});
//google.charts.setOnLoadCallback(draw_oneSampleRateCI);

function draw_oneSampleRateCI(conf,ci,p,precision) {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 'ci');
  data.addColumn('number', 'n');
  var arr = [];
  var ciStart=ci/4;
  while(ciStart < ci*2){
    var ci_value = Math.round(ciStart*Math.pow(10,precision+3))/Math.pow(10,precision+3);
    var n = Math.pow(norm_s_inv(conf+(1-conf)/2)*Math.sqrt(p*(1-p))/ci_value,2);
    arr.push([ci_value*100,Math.ceil(n)]);
    ciStart=ciStart+ci/16;
  }
  data.addRows(arr);
  var options = {
    title: 'What if you use different intervals around ' + Math.round(p*Math.pow(10,precision+3))/Math.pow(10,precision+1) + '% with ' + conf*100 + '% confidence?',
    hAxis: {
      title: 'Precision tolerance: percentage points either below or above the rate',
      titleTextStyle: {
        italic: false
      },
      baseline:0,
      gridlines:{
        minSpacing:15
      }
    },
    vAxis: {
      title: 'Required sample size',
      titleTextStyle: {
        italic: false
      }
    },
    height: 220,
    legend: {
      position:'none'
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('oneSampleRate_chart_div'));
  chart.draw(data, options);
}

function draw_oneSampleRateFixedS(conf,s,p,precision,type) {
  var data = new google.visualization.DataTable();
  data.addColumn('number', 's');
  data.addColumn('number', 'n');
  var arr = [];
  var delta = s-p;
  if (type=='not'){
    var sStart=p-Math.abs(s-p)*2;
    var sEnd=p+Math.abs(s-p)*2;
  } else {
    if ((type=='not smaller' && delta<0) || (type=='not larger' && delta>0)){
      return; //error: stops here.
    } else if (type=='not smaller'){
      var sStart=p+delta/4;
      var sEnd=p+delta*2;
    } else if (type=='not larger'){
      var sStart=p+delta*2;
      var sEnd=p+delta/4;
    }
  }
  while(sStart < sEnd){
    var s_value = Math.round(sStart*Math.pow(10,precision+3))/Math.pow(10,precision+3);
    var delta = s_value-p;
    if (type=='not'){
      var n = Math.pow(norm_s_inv(conf+(1-conf)/2)*Math.sqrt(p*(1-p))/delta,2);
    } else {
      var n = Math.pow(norm_s_inv(conf)*Math.sqrt(p*(1-p))/delta,2);
    }
    arr.push([s_value*100,Math.ceil(n)]);
    if (type=='not') sStart=sStart+Math.abs(s-p)/8;
    else sStart=sStart+Math.abs(s-p)/16;
  }
  data.addRows(arr);
  var options = {
    title: 'What if you end up measuring a different rate on your sample?',
    hAxis: {
      title: 'Measured rate',
      titleTextStyle: {
        italic: false
      },
      //baseline:0,
      gridlines:{
        minSpacing:15
      }
    },
    vAxis: {
      title: 'Required sample size',
      titleTextStyle: {
        italic: false
      }
    },
    height: 220,
    legend: {
      position:'none'
    }
  };
  var chart = new google.visualization.LineChart(document.getElementById('oneSampleRateFixed_chart_div'));
  chart.draw(data, options);
}