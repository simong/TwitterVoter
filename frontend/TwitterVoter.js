/* Author: Simon Gaeremynck
 * 
 */
;(function() {
	
	TwitterVoter = {
		config: {
			/** A string that holds what hashtag to follow. */
			hashTag: "#twitterVoter",
			
			/** 
			 * A list of options that can be voted on.
			 * It's important to note that depending the size of this list, some graphics may not be possible.
			 * For example, the speedometer graphic only works with 2 options.
			 */
			options: ["#rules", "#sucks"],
			
			backend: {
				endpoints: {
					/**
					 * The URL to fire our requests at to retrieve counts.
					 */
					counts: "/api/twittervoter/counts/",
					
					/**
					 * The URL to fire our requests at to retrieve tweets.
					 */
					tweets: "/api/twittervoter/tweets/"
				}
			}
		},
		
		
		
		/*
		 * Mostly a bunch of methods to retrieve data.
		 * Also holds some important data fields.
		 */
		data: {
			/**
			 * Makes an AJAX call to the backend that retrieves:
			 *   - The total number of votes
			 *   - A list of options, each with their current number of votes.
			 * @param {function} callback A callback method that can be called when the AJAX call returns. 
			 							  Called as follows: callback(success, data)
			 */
			fetchCounts: function(callback) {
				$.ajax({
				    url: TwitterVoter.config.backend.endpoints.counts,
				    success: function(data, textStatus, jqXHR) {
				    	callback(true, data);
				    },
				    error: function(jqXHR, textStatus, errorThrown) {
				    	callback(false, "");
				    }
				});
			},
			
			/**
			 * Makes an AJAX call to the backend that retrieves:
			 *  - The last {@see numberOfTweets} tweets for this hashtag.
			 * @param {number} numberOfTweets The number of tweets that should be fetched.
			 * @param {function} callback A callback method that can be called when the AJAX call returns. Called as follows: callback(success, data)
			 */
			fetchLatestTweets: function(numberOfTweets, callback) {
				$.ajax({
				    url: TwitterVoter.config.backend.endpoints.tweets,
				    success: function(data, textStatus, jqXHR) {
				    	callback(true, data);
				    },
				    dataType: "application/json",
				    error: function(jqXHR, textStatus, errorThrown) {
				    	callback(false, "");
				    }
				});
			}
		},
		
		graph : {
			gauge : {
				simple : function(options) {
					var rad = Math.PI / 180;
					function sector(cx, cy, r, startAngle, endAngle, params) {
					        var x1 = cx + r * Math.cos(-startAngle * rad),
					        x2 = cx + r * Math.cos(-endAngle * rad),
					        y1 = cy + r * Math.sin(-startAngle * rad),
					        y2 = cy + r * Math.sin(-endAngle * rad);
					    return paper.path(["M", cx, cy, "L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "z"]).attr(params);
					}
					
					// init
					var paper = Raphael("TwitterVoter", 1000, 1000);
					
					// Draw the outer edge
					sector(200, 200, 150, 0, 180, {"stroke":"#585858", "stroke-width": 8, "stroke-linejoin": "round"});
					
					// Draw the 2 flat ticks.
					var bottomLeftTick = paper.rect(60, 180, 10, 3);
					bottomLeftTick.attr('fill', "#585858");
					bottomLeftTick.attr('stroke-width', 0);
					var bottomRightTick = paper.rect(330, 180, 10, 3);
					bottomRightTick.attr('fill', "#585858");
					bottomRightTick.attr('stroke-width', 0);
					
					// Other ticks
					for (var i = 1; i < 8; i++) {
						var outerCircleRadius = 140,
							centerX           = 200,
							centerY           = 200,
							corner            = (Math.PI / 8) * i;
						
						var width, fillColor;
						if (i % 2 == 0) {
							// Draw a 'big' tick.
							width = 10;
							fillColor = "#585858";
						} else {
							// Draw a small tick.
							width = 5;
							fillColor = "#767676";
						}
						
						var startX = centerX - (outerCircleRadius * Math.cos(corner)) - width/2;
						var startY = centerY - (outerCircleRadius * Math.sin(corner));
						
						var tick = paper.rect(startX, startY, width, 3);
						tick.attr('stroke-width', 0);
						tick.attr('fill', fillColor);
						tick.rotate(corner / rad);
					}
					
					// Color things
					paper.path("M150,180   S 150,130 200,130    l 0,30     S 180,160 180,180 z")
						.attr({"fill": "#3e7740", 
							   "stroke-width": 0 });
					paper.path("M250,180   S 250,130 200,130    l 0,30     S 220,160 220,180 z")
						 .attr({"fill": "#840a0f",
						        "stroke-width": 0});
					
					// Gray circle for indicator
					paper.circle(200, 180, 15).attr({"fill":"#585858", "stroke-width": 0});
					
					// The indicator
					var arrow = paper.path("M193,180 l 7,-100 l 7,100")
							 		 .attr({"fill":"#585858", "stroke-width": 0});
							 		 
					
					// Calculate by how much we should rotate the arrow					
					var countA = options[0].count;
					var countB = options[1].count;
					var total = countA + countB;
					var rotation = (countB / total) * 180 -90;

					//arrow.rotate(rotation, 200, 180);
					arrow.animate({transform: "r" + rotation + ",200,180"}, 500, "bounce");
					
					// Draw fancy option labels.
					paper.rect(50, 250, 100, 50, 10)
						 .attr({
						 		"fill": "90-#336a31-#3f7540:60-#639665",
						 		"stroke": "#949da5",
						 		"stroke-width": 1
						 		});
					paper.text(115, 265, "tweet")
						 .attr("fill", "#fff")
						 .attr("font-size", 15)
						 .attr("font-weight", "bold");
					paper.text(97, 285, "#awesome")
						 .attr("fill", "#fff")
						 .attr("font-size", 15)
						 .attr("font-weight", "bold");
					
					
					
					
					paper.rect(250, 250, 100, 50, 10)
						 .attr({
						 		"fill": "90-#6e0408-#8a1215:60-#f47173",
						 		"stroke": "#949da5",
						 		"stroke-width": 1
						 		});
					paper.text(315, 265, "tweet")
						 .attr("fill", "#fff")
						 .attr("font-size", 15)
						 .attr("font-weight", "bold");		
					paper.text(298, 285, "#sucks")
						 .attr("fill", "#fff")
						 .attr("font-size", 15)
						 .attr("font-weight", "bold");
						 
				   // Copied directly from the Twitter SVG logo.
				   var bird = paper.path("m 802.97701,68.72548 c -7.60401,1.298797 -18.63251,-0.0513 -24.47607,-2.482694 12.14263,-1.005388 20.36424,-6.524765 23.53224,-14.017987 -4.37652,2.694031 -17.96978,5.628124 -25.4671,2.831502 -0.37343,-1.762507 -0.77969,-3.44089 -1.19211,-4.959232 -5.70814,-21.012617 -25.29064,-37.946229 -45.79441,-35.89852 1.65376,-0.670943 3.33009,-1.294694 5.02489,-1.863046 2.24468,-0.808414 15.49734,-2.9710253 13.4127,-7.6430035 C 746.25259,0.572459 730.06379,7.7907371 727.0189,8.7407266 731.0425,7.232644 737.69858,4.6309451 738.40646,3.1740001e-6 732.24486,0.84535013 726.19407,3.7630282 721.52209,8.0041257 723.21278,6.1882712 724.49106,3.974365 724.7619,1.5860546 708.31867,12.103648 698.71414,33.290669 690.94597,53.858043 684.84593,47.934458 679.42504,43.270688 674.57661,40.675144 660.96693,33.378897 644.68785,25.75436 619.14278,16.258569 c -0.78585,8.459625 4.17749,19.717923 18.47042,27.192678 -3.09414,-0.41857 -8.75714,0.519109 -13.27934,1.594259 1.84048,9.703023 7.86665,17.686628 24.19088,21.544036 -7.45834,0.490384 -11.31985,2.199544 -14.80999,5.851771 3.39575,6.746361 11.69534,14.676618 26.59971,13.045427 -16.58686,7.158776 -6.76483,20.40938 6.732,18.43144 -23.01109,23.80513 -59.3015,22.03852 -80.14177,2.14619 54.40177,74.20998 172.67238,43.88213 190.28924,-27.59483 13.21778,0.106694 20.96953,-4.575543 25.78308,-9.74406 z")
				   			   .attr("fill", "#fff")
				   			   .attr("stroke-width", 0)
				   			   .translate(-500, 190)
				   			   .scale(0.1, 0.1);
				   
				   var left_bird = bird.clone().translate(-1200, 0);
				   var right_bird = bird.clone().translate(800, 0);
				   
				   bird.remove();
				   			   
				}
			}
		},
		
		
		api: {
			/**
			 * Fires up the necessary interactions, puts the correct HTML in the divs.
			 */
			load: function() {
				TwitterVoter.data.fetchCounts(function(is_success, data) {
					if (is_success) {
						TwitterVoter.graph.gauge.simple(data.options);
					} else {
						console.log("Failed to fetch counts.");
					}
				});
			}
		}
		
	};
	
	
	TwitterVoter.api.load();
	
}());