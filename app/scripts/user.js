var edges = [];
for (var i = 0; i < 40; i++) {
    edges[i] = [];
}
var selectedCount = 0;
var selectedEdge = "";
var globalLink;
var globalGraph;
var graphWithWalking = [];
for (var i = 0; i < 40; i++) {
    graphWithWalking[i] = [];
    for (var j = 0; j < 40; j++) {
        graphWithWalking[i][j] = Infinity;
    }
}
var maintainedEdges = [];
var currentPathLength = 0;
var originalPathLength = 0;
var originalGraph = [];
for (var i = 0; i < 40; i++) {
    originalGraph[i] = [];
    for (var j = 0; j < 40; j++) {
        originalGraph[i][j] = Infinity;
    }
}
var isMaintained = false;
var edgeToItemObj = {};
var firstTime = true;

function runAlgorithm() {
    if (selectedCount == 2) {
        isMaintained = true;
        for (key in edgeToItemObj) {
            // console.log(edgeToItemObj[key]);
            if (edgeToItemObj[key].classList[0] != "link-walk" &&
                edgeToItemObj[key].classList[0] != "link-maintain") {
                edgeToItemObj[key].classList = ["no-link"];
            }
        }
        var shortestPathInfo = dijkstra();
        var path = constructPath(shortestPathInfo);
        var prev = shortestPathInfo.startVertex;
        for (var i = 0; i < path.length; i++) {
            edges[prev][path[i]] = 1;
            edges[path[i]][prev] = 1;
            prev = path[i];
        }
        assignLinkClass(globalLink, globalGraph);
        constructPathOriginal(dijkstraOriginal());
        $('#values').text("Original trip length: " + originalPathLength + ", Current trip length: " + currentPathLength);
        for (key in edgeToItemObj) {
            console.log(edgeToItemObj[key].classList);
        }
    } else {
        document.getElementById("overlay").style.visibility = "visible";
        document.getElementById("overlay").style.opacity = "1";
        // TODO: Edit text
        $("#pop-up-content").text("You must have exactly two stations selected in order to get directions.");
    }
}

function assignLinkClass(link, graph) {
    var maintainCount = 0;
    link = link.data(graph.links).enter().append("line")
    .attr("class", function(d) {
        for (var i = 0; i < maintainedEdges.length; i++) {
            var tracks = maintainedEdges[i].split(",");
            if ((d.source["id"] == tracks[0] && d.target["id"] == tracks[1]) ||
                (d.source["id"] == tracks[1] && d.target["id"] == tracks[0])) {
                graphWithWalking[d.source["id"]][d.target["id"]] = Infinity;
                graphWithWalking[d.target["id"]][d.source["id"]] = Infinity;
                return "link-maintain";
            }
        }

        if (edges[d.source["id"]][d.target["id"]] != undefined) {
            if (d.color == "WALK") {
                maintainCount++;
                return "link-maintain-walk";
            } else {
                maintainCount++;
                if (d.color === "BLUE") {
                    return "link-blue";
                } else if (d.color === "RED") {
                    return "link-red";
                } else if (d.color === "GREEN") {
                    return "link-green";
                } else if (d.color === "ORANGE") {
                    return "link-orange";
                } else if (d.color === "YELLOW") {
                    return "link-yellow";
                } else if (d.color === "BROWN") {
                    return "link-brown";
                } else if (d.color === "WALK") {
                    return "link-walk";
                }
                // return "link-selected";
            }
        }

        if (isMaintained) {
            if (d.color === "BLUE") {
                return "light-blue";
            } else if (d.color === "RED") {
                return "light-red";
            } else if (d.color === "GREEN") {
                return "light-green";
            } else if (d.color === "ORANGE") {
                return "light-orange";
            } else if (d.color === "YELLOW") {
                return "light-yellow";
            } else if (d.color === "BROWN") {
                return "light-brown";
            }
        } else {
            if (d.color === "BLUE") {
                return "link-blue";
            } else if (d.color === "RED") {
                return "link-red";
            } else if (d.color === "GREEN") {
                return "link-green";
            } else if (d.color === "ORANGE") {
                return "link-orange";
            } else if (d.color === "YELLOW") {
                return "link-yellow";
            } else if (d.color === "BROWN") {
                return "link-brown";
            }
        }

        if (d.color === "WALK") {
            return "link-walk";
        }
        // if (edges[d.source["id"]][d.target["id"]] != 0) {
        //     return "link-maintain";
        // } else {
        //     return "link";
        // }
        return "link";
    })
    .attr("x1", function(d) { return d.source.x; })
    .attr("y1", function(d) { return d.source.y; })
    .attr("x2", function(d) { return d.target.x; })
    .attr("y2", function(d) { return d.target.y; });

    if (firstTime) {
        firstTime = false;
        var children = link[0].parentNode.childNodes;
        var count = 0;
        for (var item of children.entries()) {
            var pos0 = item[1].attributes[1].nodeValue + "," + item[1].attributes[2].nodeValue;
            var pos1 = item[1].attributes[3].nodeValue + "," + item[1].attributes[4].nodeValue;
            var edge = pos0 + "-" + pos1;
            edgeToItemObj[edge] = item[1];
            count++;
        }
    }
}

function dijkstra() {
    var numVertices = 40;
    var e = selectedEdge.split(",");
    var startVertex = parseInt(e[0]);
    var done = new Array(numVertices);
    done[startVertex] = true;
    var pathLengths = new Array(numVertices);
    var predecessors = new Array(numVertices);

    for (var i = 0; i < numVertices; i++) {
        pathLengths[i] = graphWithWalking[startVertex][i];
        if (graphWithWalking[startVertex][i] != Infinity) {
            predecessors[i] = startVertex;
        }
    }

    pathLengths[startVertex] = 0;

    for (var i = 0; i < numVertices - 1; i++) {
        var closest = -1;
        var closestDistance = Infinity;
        for (var j = 0; j < numVertices; j++) {
            if (!done[j] && pathLengths[j] < closestDistance) {
                closestDistance = pathLengths[j];
                closest = j;
            }
        }

        done[closest] = true;

        for (var j = 0; j < numVertices; j++) {
            if (!done[j]) {
                var possiblyCloserDistance = pathLengths[closest] + graphWithWalking[closest][j];
                if (possiblyCloserDistance < pathLengths[j]) {
                    pathLengths[j] = possiblyCloserDistance;
                    predecessors[j] = closest;
                }
            }
        }
    }

  return { "startVertex": startVertex,
           "pathLengths": pathLengths,
           "predecessors": predecessors };
}

function constructPath(shortestPathInfo) {
    var e = selectedEdge.split(",");
    var endVertex = parseInt(e[1]);
    currentPathLength = shortestPathInfo.pathLengths[endVertex];
    var path = [];
    while (endVertex != shortestPathInfo.startVertex) {
        path.unshift(endVertex);
        endVertex = shortestPathInfo.predecessors[endVertex];
    }
    return path;
}

function dijkstraOriginal() {
    console.log(originalGraph);
    var numVertices = 40;
    var e = selectedEdge.split(",");
    var startVertex = parseInt(e[0]);
    var done = new Array(numVertices);
    done[startVertex] = true;
    var pathLengths = new Array(numVertices);
    var predecessors = new Array(numVertices);

    for (var i = 0; i < numVertices; i++) {
        pathLengths[i] = originalGraph[startVertex][i];
        if (originalGraph[startVertex][i] != Infinity) {
            predecessors[i] = startVertex;
        }
    }

    pathLengths[startVertex] = 0;

    for (var i = 0; i < numVertices - 1; i++) {
        var closest = -1;
        var closestDistance = Infinity;
        for (var j = 0; j < numVertices; j++) {
            if (!done[j] && pathLengths[j] < closestDistance) {
                closestDistance = pathLengths[j];
                closest = j;
            }
        }

        done[closest] = true;

        for (var j = 0; j < numVertices; j++) {
            if (!done[j]) {
                var possiblyCloserDistance = pathLengths[closest] + originalGraph[closest][j];
                if (possiblyCloserDistance < pathLengths[j]) {
                    pathLengths[j] = possiblyCloserDistance;
                    predecessors[j] = closest;
                }
            }
        }
    }

  return { "startVertex": startVertex,
           "pathLengths": pathLengths,
           "predecessors": predecessors };
}

function constructPathOriginal(shortestPathInfo) {
    var e = selectedEdge.split(",");
    var endVertex = parseInt(e[1]);
    originalPathLength = shortestPathInfo.pathLengths[endVertex];
    var path = [];
    while (endVertex != shortestPathInfo.startVertex) {
        path.unshift(endVertex);
        endVertex = shortestPathInfo.predecessors[endVertex];
    }
    return path;
}

function selectableForceDirectedGraph() {
    console.log(document.cookie);
    if (document.cookie.split("; ")[1] != undefined) {
        maintainedEdges = document.cookie.split("; ")[1].split("-");
    } else {
        maintainedEdges = document.cookie.split("-");
    }
    var width = 740,
    height = 720,
    shiftKey, ctrlKey;

    var nodeGraph = null;
    var xScale = d3.scale.linear()
    .domain([0,width]).range([0,width]);
    var yScale = d3.scale.linear()
    .domain([0,height]).range([0, height]);

    var svg = d3.select("#d3_selectable_force_directed_graph")
    .attr("tabindex", 1)
    .on("keydown.brush", keydown)
    .on("keyup.brush", keyup)
    .each(function() { this.focus(); })
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", "svgToBorder");

    var zoomer = d3.behavior.zoom().
        scaleExtent([0.1,10]).
        x(xScale).
        y(yScale).
        on("zoomstart", zoomstart).
        on("zoom", redraw);

    function zoomstart() {
        node.each(function(d) {
            d.selected = false;
            d.previouslySelected = false;
        });
        node.classed("selected", false);
    }

    function redraw() {
        vis.attr("transform",
                 "translate(" + d3.event.translate + ")" + " scale(" + d3.event.scale + ")");
    }

    var brusher = d3.svg.brush()
    //.x(d3.scale.identity().domain([0, width]))
    //.y(d3.scale.identity().domain([0, height]))
    .x(xScale)
    .y(yScale)
    .on("brushstart", function(d) {
        node.each(function(d) { 
            d.previouslySelected = shiftKey && d.selected; });
    })
    .on("brush", function() {
        var extent = d3.event.target.extent();

        node.classed("selected", function(d) {
            return d.selected = d.previouslySelected ^
            (extent[0][0] <= d.x && d.x < extent[1][0]
             && extent[0][1] <= d.y && d.y < extent[1][1]);
        });
    })
    .on("brushend", function() {
        d3.event.target.clear();
        d3.select(this).call(d3.event.target);
    });

    var svg_graph = svg.append('svg:g')
    .call(zoomer)
    //.call(brusher)

    var rect = svg_graph.append('svg:rect')
    .attr('width', width)
    .attr('height', height)
    .attr('fill', 'transparent')
    //.attr('opacity', 0.5)
    .attr('stroke', 'transparent')
    .attr('stroke-width', 1)
    //.attr("pointer-events", "all")
    .attr("id", "zrect")

    var brush = svg_graph.append("g")
    .datum(function() { return {selected: false, previouslySelected: false}; })
    .attr("class", "brush");

    var vis = svg_graph.append("svg:g");

    // vis.attr('fill', 'red')
    vis.attr('fill', 'black')
    .attr('stroke', 'black')
    .attr('stroke-width', 1)
    // .attr('opacity', 0.5)
    .attr('opacity', 1)
    .attr('id', 'vis')


    brush.call(brusher)
    .on("mousedown.brush", function(d) {
        selectedCount = 0;
        selectedEdge = "";
        console.log(selectedCount);
    })
    .on("touchstart.brush", null) 
    .on("touchmove.brush", null)
    .on("touchend.brush", null); 

    brush.select('.background').style('cursor', 'auto');

    var link = vis.append("g")
    // .attr("class", "link")
    .selectAll("line");

    var node = vis.append("g")
    .attr("class", "node")
    .selectAll("circle");

    center_view = function() {
        // Center the view on the molecule(s) and scale it so that everything
        // fits in the window

        if (nodeGraph === null)
            return;

        var nodes = nodeGraph.nodes;

        //no molecules, nothing to do
        if (nodes.length === 0)
            return;

        // Get the bounding box
        min_x = d3.min(nodes.map(function(d) {return d.x;}));
        min_y = d3.min(nodes.map(function(d) {return d.y;}));

        max_x = d3.max(nodes.map(function(d) {return d.x;}));
        max_y = d3.max(nodes.map(function(d) {return d.y;}));


        // The width and the height of the graph
        mol_width = max_x - min_x;
        mol_height = max_y - min_y;

        // how much larger the drawing area is than the width and the height
        width_ratio = width / mol_width;
        height_ratio = height / mol_height;

        // we need to fit it in both directions, so we scale according to
        // the direction in which we need to shrink the most
        min_ratio = Math.min(width_ratio, height_ratio) * 0.8;

        // the new dimensions of the molecule
        new_mol_width = mol_width * min_ratio;
        new_mol_height = mol_height * min_ratio;

        // translate so that it's in the center of the window
        x_trans = -(min_x) * min_ratio + (width - new_mol_width) / 2;
        y_trans = -(min_y) * min_ratio + (height - new_mol_height) / 2;


        // do the actual moving
        vis.attr("transform",
                 "translate(" + [x_trans, y_trans] + ")" + " scale(" + min_ratio + ")");

                 // tell the zoomer what we did so that next we zoom, it uses the
                 // transformation we entered here
                 zoomer.translate([x_trans, y_trans ]);
                 zoomer.scale(min_ratio);

    };

    function dragended(d) {
        //d3.select(self).classed("dragging", false);
        node.filter(function(d) { return d.selected; })
        .each(function(d) { d.fixed &= ~6; })

    }

    d3.json("graphWithWalking.json", function(error, graph) {
        nodeGraph = graph;
        // console.log(node);

        // graph.nodes.forEach(function(d) {
        //     console.log(d);
        // })

        graph.links.forEach(function(d) {
            // console.log("source: " + d.source + ", target: " + d.target);
            if (graphWithWalking[d.source][d.target] === Infinity &&
                graphWithWalking[d.target][d.source] === Infinity) {
                graphWithWalking[d.source][d.target] = d.weight;
                graphWithWalking[d.target][d.source] = d.weight;

                originalGraph[d.source][d.target] = d.weight;
                originalGraph[d.target][d.source] = d.weight;
            } else if (d.weight < graphWithWalking[d.source][d.target]) {
                // console.log(d);
                graphWithWalking[d.source][d.target] = d.weight;
                graphWithWalking[d.target][d.source] = d.weight;

                originalGraph[d.source][d.target] = d.weight;
                originalGraph[d.target][d.source] = d.weight;
            }
            d.source = graph.nodes[d.source];
            d.target = graph.nodes[d.target];
        });

        // TODO: Check
        assignLinkClass(link, graph);
        globalLink = link;
        globalGraph = graph;

        // var force = d3.layout.force()
        // .charge(-120)
        // .linkDistance(30)
        // .nodes(graph.nodes)
        // .links(graph.links)
        // .size([width, height])
        // .start();

        function dragstarted(d) {
            d3.event.sourceEvent.stopPropagation();
            if (!d.selected && !shiftKey) {
                // if this node isn't selected, then we have to unselect every other node
                node.classed("selected", function(p) { return p.selected =  p.previouslySelected = false; });
            }

            d3.select(this).classed("selected", function(p) { d.previouslySelected = d.selected; return d.selected = true; });

            node.filter(function(d) { return d.selected; })
            .each(function(d) { d.fixed |= 2; })
        }

        function dragged(d) {
            // node.filter(function(d) { return d.selected; })
            // .each(function(d) { 
            //     d.x += d3.event.dx;
            //     d.y += d3.event.dy;

            //     d.px += d3.event.dx;
            //     d.py += d3.event.dy;
            // })

            // force.resume();
        }

    node.data(graph.nodes).enter().append("text")
            .attr({
              // "text-anchor": "middle",
              "font-size": 10,
              // "font-family:": "sans-serif",
              "z": 1,
              "x": function(d) {
                return d.x + 10;
              },
              "y": function(d) {
                return d.y;
              },
              // "color": "black"
            })
            .text(function(d) { return d.name });

        node = node.data(graph.nodes).enter().append("circle")
        .attr("r", 4)
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .on("dblclick", function(d) { d3.event.stopPropagation(); })
        .on("click", function(d) {
            if (d3.event.defaultPrevented) {
                return;
            }

            if (!shiftKey) {
                // If the shift key isn't down, unselect everything
                node.classed("selected", function(p) {
                    return p.selected = p.previouslySelected = false;
                })
                selectedCount = 0;
                selectedEdge = "";
            }

            // Always select this node
            // d3.select(this).classed("selected", d.selected = !d.previouslySelected);
            d3.select(this).classed("selected", function(p) {
                if (selectedCount == 0) {
                    selectedEdge = "";
                    selectedEdge += p["id"];
                } else if (selectedCount = 1) {
                    selectedEdge += "," + p["id"];
                    console.log(selectedEdge);
                }
                return d.selected = !d.previouslySelected;
            })
            selectedCount++;
            console.log(selectedCount);
        })

        // brush.on("click", function(d) {
        //     selectedCount = 0;
        // })

        .on("mouseup", function(d) {
            //if (d.selected && shiftKey) d3.select(this).classed("selected", d.selected = false);
        })
        .call(d3.behavior.drag()
              .on("dragstart", dragstarted)
              .on("drag", dragged)
              .on("dragend", dragended));

              function tick() {
                  link.attr("x1", function(d) { return d.source.x; })
                  .attr("y1", function(d) { return d.source.y; })
                  .attr("x2", function(d) { return d.target.x; })
                  .attr("y2", function(d) { return d.target.y; });

                  node.attr('cx', function(d) { return d.x; })
                  .attr('cy', function(d) { return d.y; });

              };

              // force.on("tick", tick);

    });


    function keydown() {
        shiftKey = d3.event.shiftKey || d3.event.metaKey;
        ctrlKey = d3.event.ctrlKey;

        console.log('d3.event', d3.event)

        if (d3.event.keyCode == 67) {   //the 'c' key
            center_view();
        }

        if (shiftKey) {
            svg_graph.call(zoomer)
            .on("mousedown.zoom", null)
            .on("touchstart.zoom", null)                                                                      
            .on("touchmove.zoom", null)                                                                       
            .on("touchend.zoom", null);                                                                       

            //svg_graph.on('zoom', null);                                                                     
            vis.selectAll('g.gnode')
            .on('mousedown.drag', null);

            brush.select('.background').style('cursor', 'crosshair')
            brush.call(brusher);
        }
    }

    function keyup() {
        shiftKey = d3.event.shiftKey || d3.event.metaKey;
        ctrlKey = d3.event.ctrlKey;

        brush.call(brusher)
        .on("mousedown.brush", function() {
            selectedCount = 0;
            selectedEdge = "";
            console.log(selectedCount);
        })
        .on("touchstart.brush", null)                                                                      
        .on("touchmove.brush", null)                                                                       
        .on("touchend.brush", null);                                                                       

        brush.select('.background').style('cursor', 'auto')
        svg_graph.call(zoomer);
    }
}
