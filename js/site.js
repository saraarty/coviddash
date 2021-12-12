
var seriesX = [];
var chart1;

var seriesX2 = [];
var countries2 = [];
var chart2;

var seriesX3 = [];
var chart3;

var seriesX4 = [];
var chart4;

async function dataChanged1() {

    seriesX1 = [];

    for (let ctr of vueApp.$data.selectedCountries) {
        for (let atrib of vueApp.$data.selectedAttributes) {

            seriesX1.push(await getJSON(ctr, atrib, vueApp.$data.selectedOptions.includes("smoothed"), vueApp.$data.selectedOptions.includes("per_million"), vueApp.$data.selectedOptions.includes("per_hundred")));

        }
    }

    if (chart1 != null) {

        if (seriesX1.length == 0) {
            chart1.destroy();
            chart1 = null;
        } else {

            while (chart1.series.length > 0) {
                chart1.series[0].remove(false)
            }

            for (let newData of seriesX1) {

                chart1.addSeries(newData, false);

            }

            chart1.redraw()
        }

    } else {

        if (seriesX1.length > 0) {
            chart1 = Highcharts.chart('chart-line', {
                chart: {
                    type: 'line',
                    zoomType: 'x'
                },
                title: {
                    text: ''
                },
                credits: {
                    enabled: false
                },
                xAxis: {
                    type: "datetime",
                },
                yAxis: [
                    {
                        title: {
                            text: '',
                        }
                    },
                ],
                series: seriesX1
            })
        }

    }

}

async function dataChanged2() {

    if (vueApp.$data.selectedAttributes.length > 1 && vueApp.$data.selectedCountries.length > 1) {

        countries2 = []
        seriesX2 = [];

        var isFirstAttrib = true;

        for (let atrib of vueApp.$data.selectedAttributes) {

            var attribData = {
                name: null,
                data: []
            };

            for (let ctr of vueApp.$data.selectedCountries) {

                var jsonVal = await getJSON(ctr, atrib, vueApp.$data.selectedOptions.includes("smoothed"), vueApp.$data.selectedOptions.includes("per_million"), vueApp.$data.selectedOptions.includes("per_hundred"));

                attribData.data.push(jsonVal.last);

                if (isFirstAttrib) {
                    countries2.push(jsonVal.country);
                }
                if (attribData.name == null) {
                    attribData.name = jsonVal.title;
                }

            }

            isFirstAttrib = false;

            seriesX2.push(attribData);
        }

        if (chart2 != null) {

            if (seriesX2.length == 0) {
                chart2.destroy();
                chart2 = null;
            } else {

                while (chart2.series.length > 0) {
                    chart2.series[0].remove(false)
                }

                for (let newData of seriesX2) {

                    chart2.addSeries(newData, false);

                }
                //chart2.update({
                //    xAxis: {
                //        categories: countries2
                //    }
                //}, false);

                chart2.redraw()
            }

        } else {

            if (seriesX2.length > 0) {
                chart2 = Highcharts.chart('chart-bar', {
                    chart: {
                        type: 'column'
                    },
                    title: {
                        text: 'Latest Data'
                    },
                    credits: {
                        enabled: false
                    },
                    xAxis: {
                        categories: countries2
                    },
                    yAxis: {
                        title: {
                            text: ''
                        }
                    },
                    series: seriesX2
                });
            }

        }

    } else {
        if (chart2 != null) {
            chart2.destroy();
            chart2 = null;
        }
    }

}

async function dataChanged3() {

    if (vueApp.$data.selectedAttributes.length == 1 || vueApp.$data.selectedCountries.length == 1) {
        seriesX3 = [];

        var chartData = {
            name: null,
            data: []
        };

        for (let atrib of vueApp.$data.selectedAttributes) {

            for (let ctr of vueApp.$data.selectedCountries) {

                var jsonVal = await getJSON(ctr, atrib, vueApp.$data.selectedOptions.includes("smoothed"), vueApp.$data.selectedOptions.includes("per_million"), vueApp.$data.selectedOptions.includes("per_hundred"));

                chartData.data.push({
                    name: ((vueApp.$data.selectedAttributes.length == 1) ? jsonVal.country : jsonVal.title),
                    y: jsonVal.last,
                });

                if (chartData.name == null) {
                    chartData.name = ((vueApp.$data.selectedCountries.length == 1 && vueApp.$data.selectedAttributes.length != 1) ? jsonVal.country : jsonVal.title);
                }

            }
        }

        if (vueApp.$data.selectedAttributes.length > 0 && vueApp.$data.selectedCountries.length > 0) {
            seriesX3.push(chartData);
        }

        if (chart3 != null) {

            if (seriesX3.length == 0) {
                chart3.destroy();
                chart3 = null;
            } else {

                while (chart3.series.length > 0) {
                    chart3.series[0].remove(false)
                }

                for (let newData of seriesX3) {

                    chart3.addSeries(newData, false);

                }

                chart3.redraw()
            }

        } else {

            if (seriesX3.length > 0) {
                chart3 = Highcharts.chart('chart-pie', {
                    chart: {
                        type: 'pie'
                    },
                    title: {
                        text: 'Latest Data'
                    },
                    credits: {
                        enabled: false
                    },
                    series: seriesX3
                });
            }

        }
    } else {
        if (chart3 != null) {
            chart3.destroy();
            chart3 = null;
        }
    }

}

async function dataChanged4() {

    if (vueApp.$data.selectedAttributes.length == 1 && vueApp.$data.selectedCountries.length == 0) {

        seriesX4 = [];

        var mapData = await getJSON("ALL", vueApp.$data.selectedAttributes[0], vueApp.$data.selectedOptions.includes("smoothed"), vueApp.$data.selectedOptions.includes("per_million"), vueApp.$data.selectedOptions.includes("per_hundred"));

        seriesX4 = mapData.data
        if (chart4 != null) {

            chart4.destroy();
            chart4 = null;
        }

        if (seriesX4.length > 0) {
            chart4 =
                Highcharts.mapChart('chart-map', {
                    chart: {
                        borderWidth: 1,
                        map: 'custom/world'
                    },

                    title: {
                        text: mapData.title
                    },

                    credits: {
                        enabled: false
                    },

                    legend: {
                        enabled: false
                    },

                    mapNavigation: {
                        enabled: true,
                        buttonOptions: {
                            verticalAlign: 'bottom'
                        }
                    },

                    series: [{
                        name: 'Countries',
                        color: '#E0E0E0',
                        enableMouseTracking: false
                    }, {
                        type: 'mapbubble',
                        name: mapData.title,
                        joinBy: ['iso-a3', 'code3'],
                        data: seriesX4,
                        minSize: 4,
                        maxSize: '12%',
                        tooltip: {
                            pointFormat: '{point.properties.hc-a2}: {point.z} thousands'
                        }
                    }]
                });
        }
    } else {
        if (chart4 != null) {
            chart4.destroy();
            chart4 = null;
        }
    }

}

async function dataChanged5() {

    for (let ctr of vueApp.$data.selectedCountries) {
        for (let atrib of vueApp.$data.selectedAttributes) {
            if (atrib == "total_deaths" || atrib == "total_cases") {

                for (let pred of vueApp.$data.selectedPredictions) {

                    seriesX1.push(await getJSON(ctr, atrib, vueApp.$data.selectedOptions.includes("smoothed"), vueApp.$data.selectedOptions.includes("per_million"), vueApp.$data.selectedOptions.includes("per_hundred"), true, (pred == "poly")));
                }

            }
        }
    }

    if (chart1 != null) {

        while (chart1.series.length > 0) {
            chart1.series[0].remove(false)
        }

        for (let newData of seriesX1) {

            chart1.addSeries(newData, false);

        }

        chart1.redraw()

    }

}

async function dataChanged6() {

    var my_YAxis = [
        {
            title: {
                text: '',
            },
            plotLines: []
        }
    ];
    var anySelected = false;
    var tempSel = false;
    var appleSel = false;

    for (let ctr of vueApp.$data.selectedCountries) {
        for (let ext of vueApp.$data.selectedExtras) {
            if (ctr == "NOR" && ext == "oslo_temp") {

                anySelected = true;
                tempSel = true;

                seriesX1.push(await get_Oslo_Temperature());

            }
            if (ext == "population") {

                anySelected = true;

                var jsonData = await getPopulation(ctr);
                if (jsonData) {

                    my_YAxis[0].plotLines.push(jsonData);


                    seriesX1.push({
                        type: 'scatter',
                        marker: {
                            enabled: false
                        },
                        data: [[1638921600000, jsonData.value]],
                        enableMouseTracking: false,
                        showInLegend: false
                    });
                }

            }
            if (ext == "apple_driving") {
                anySelected = true;
                appleSel = true;
                var jsonData = await getJSON(ctr, ext, false, false, false, false);
                if (jsonData) {
                    seriesX1.push(jsonData);
                }
            }
            if (ext == "apple_walking") {
                anySelected = true;
                appleSel = true;
                var jsonData = await getJSON(ctr, ext, false, false, false, false);
                if (jsonData) {
                    seriesX1.push(jsonData);
                }
            }
            if (ext == "apple_transit") {
                anySelected = true;
                appleSel = true;
                var jsonData = await getJSON(ctr, ext, false, false, false, false);
                if (jsonData) {
                    seriesX1.push(jsonData);
                }
            }
        }
    }

    if (anySelected) {

        my_YAxis.push({
            title: {
                text: 'Temperature'
            },
            opposite: true,
            visible: tempSel,
        });

        my_YAxis.push({
            title: {
                text: 'Apple Mobility Trends'
            },
            opposite: true,
            visible: appleSel,
        });

        if (chart1 != null) {
            chart1.destroy();
            chart1 = null;
        }

        chart1 = Highcharts.chart('chart-line', {
            chart: {
                type: 'line',
                zoomType: 'x'
            },
            title: {
                text: ''
            },
            credits: {
                enabled: false
            },
            xAxis: {
                type: "datetime",
            },
            yAxis: my_YAxis,
            series: seriesX1
        })
    }

}

function loadCountries() {
    $.ajax({
        dataType: "json",
        url: '/coviddash/data/app/Countries.json?v=1.1',
        async: false,
        success: function (data) {
            countriesList = data;
        }
    });
}


async function getJSON(countryCode, attributeCode, smoothed, perMillion, perHundred, isPred, isPred_poly) {
    return fetch('/coviddash/data/' + countryCode + '_' + attributeCode + ((isPred && isPred_poly) ? "_poly" : "") + ((isPred && !isPred_poly) ? "_bay" : "") + ((smoothed && attributeCode.startsWith("new_")) ? "_smoothed" : "") + ((perMillion) ? "_per_million" : "") + ((perHundred && (attributeCode.startsWith("people_"))) ? "_per_hundred" : "") + '.json?v=1.1')
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                return null;
            }
        })
}

async function get_Oslo_Temperature() {
    return fetch('/coviddash/data/app/Oslo_Temperature.json?v=1.1')
        .then((response) => response.json())
}

async function getPopulation(countryCode) {
    return fetch('/coviddash/data/' + countryCode + '_population.json?v=1.1')
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                return null;
            }
        })
}

var countriesList;

var vueApp;

$(function () {

    loadCountries();

    vueApp = new Vue({
        el: '#app',
        vuetify: new Vuetify(),
        data: {
            allCountries: countriesList,
            allAttributes: [
                {
                    title: "New Cases",
                    value: "new_cases"
                },
                {
                    title: "New Deaths",
                    value: "new_deaths"
                },
                {
                    title: "Total Cases",
                    value: "total_cases"
                },
                {
                    title: "Total Deaths",
                    value: "total_deaths"
                },
                {
                    title: "People Vaccinated",
                    value: "people_vaccinated"
                },
                {
                    title: "People Fully Vaccinated",
                    value: "people_fully_vaccinated"
                }
            ],
            allOptions: [
                {
                    title: "Smoothed (For: New Cases, New Deaths.)",
                    value: "smoothed"
                },
                {
                    title: "Per Million",
                    value: "per_million"
                },
                {
                    title: "Per Hundred (For: People Vaccinated, People Fully Vaccinated.)",
                    value: "per_hundred"
                }
            ],
            allPredictions: [
                {
                    title: "Polynomial Regression (For: Total Cases, Total Deaths.)",
                    value: "poly"
                },
                {
                    title: "Bayesian Ridge Regression (For: Total Cases, Total Deaths.)",
                    value: "bay"
                }
            ],
            allExtras: [
                {
                    title: "Population",
                    value: "population"
                },
                {
                    title: "Oslo Temperature (For: Norway.)",
                    value: "oslo_temp"
                },
                {
                    title: "Driving (Apple Mobility Trends)",
                    value: "apple_driving"
                },
                {
                    title: "Walking (Apple Mobility Trends)",
                    value: "apple_walking"
                },
                {
                    title: "Transit (Apple Mobility Trends)",
                    value: "apple_transit"
                }
            ],
            selectedCountries: [],
            selectedAttributes: [],
            selectedOptions: [],
            selectedPredictions: [],
            selectedExtras: [],
        },
        watch: {
            selectedCountries: function () {
                dataChanged1();
                dataChanged2();
                dataChanged3();
                dataChanged4();
                dataChanged5();
                dataChanged6();
            },
            selectedAttributes: function () {
                dataChanged1();
                dataChanged2();
                dataChanged3();
                dataChanged4();
                dataChanged5();
                dataChanged6();
            },
            selectedOptions: function () {
                dataChanged1();
                dataChanged2();
                dataChanged3();
                dataChanged4();
                dataChanged5();
                dataChanged6();
            },
            selectedPredictions: function () {
                dataChanged1();
                dataChanged2();
                dataChanged3();
                dataChanged4();
                dataChanged5();
                dataChanged6();
            },
            selectedExtras: function () {
                dataChanged1();
                dataChanged2();
                dataChanged3();
                dataChanged4();
                dataChanged5();
                dataChanged6();
            }
        },


    })

})