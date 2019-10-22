var statistics = {
    charts: {},

    save: function(chart_name, dataset_name, value) {
        //check, if chart is already in charts, if not create new chart
        if (chart_name in statistics.charts === false) {
            var statistics_container = document.getElementById("statistics_container");
            var new_chart_container = document.createElement("div");
            var new_chart_container_heading = document.createElement("h4");
            var new_chart_container_chart = document.createElement("canvas");

            statistics_container.append(new_chart_container);
            new_chart_container.append(new_chart_container_heading);
            new_chart_container.append(new_chart_container_chart);
            new_chart_container.classList.add("chart_container");
            new_chart_container_heading.innerText = chart_name;

            var new_chart = new Chart(new_chart_container_chart, {
                type: "line",
                data: {
                    labels: [],
                    datasets: []
                },
                options: {
                    animation: {
                        duration: 0
                    }
                }
            });

            statistics.charts[chart_name] = new_chart;
        }


        //check, if dataset is already in chart, if not create new dataset
        var dataset_already_in_chart = false;

        for (ds of statistics.charts[chart_name].data.datasets) {
            if (ds.label == dataset_name) {
                dataset_already_in_chart = true;
            }
        }

        if (dataset_already_in_chart === false) {            
            var new_dataset = {
                data: [],
                label: dataset_name
            }

            statistics.charts[chart_name].data.datasets.push(new_dataset);
        }


        //add data to dataset
        for (dataset of statistics.charts[chart_name].data.datasets) {
            if (dataset.label == dataset_name) {
                dataset.data.push(value)

                if (statistics.charts[chart_name].data.labels.indexOf(time) == -1) {
                    statistics.charts[chart_name].data.labels.push(time);
                }
            }
        }


        statistics.charts[chart_name].update();
    },



    clear: function() {
        statistics.data = {};
        statistics.charts = {};

        var chart_containers = document.querySelectorAll(".chart_container");

        for (chart_container of chart_containers) {
            chart_container.remove();
        }
    }
};
