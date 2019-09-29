var statistics = {
    data: {},

    charts: {},

    save: function(dataset, value) {
        if (dataset in statistics.data === false) {
            statistics.data[dataset] = [];

            var statistics_container = document.getElementById("statistics_container");
            var new_dataset_container = document.createElement("div");
            var new_dataset_container_heading = document.createElement("h4");
            var new_dataset_container_graph = document.createElement("canvas");

            new_dataset_container.setAttribute("data-dataset_name", dataset);
            new_dataset_container.classList.add("chart_container");

            new_dataset_container_heading.innerText = dataset;

            new_dataset_container.append(new_dataset_container_heading);
            new_dataset_container.append(new_dataset_container_graph);

            statistics_container.append(new_dataset_container);

            var chart = new Chart(new_dataset_container_graph, {
                type: "line",
                data: {
                    labels: [],
                    datasets: [{
                         label: dataset,
                         data: statistics.data[dataset]
                    }]
                }
            });

            statistics.charts[dataset] = chart;
        }


        if (statistics.charts[dataset].data.labels.indexOf(time) == -1) {
            statistics.data[dataset].push(value);
            statistics.charts[dataset].data.labels.push(time);
            statistics.charts[dataset].update();
        }
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
