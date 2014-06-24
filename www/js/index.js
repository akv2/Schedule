/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
		// We are going to try to get new data every time the app is "ready"
		app.getNewData();
		
		$('a.reload').on('click', function(e) {
			e.preventDefault();
			
			$('#table').html('');
			app.getNewData();
		});
    },
	
	// Get new data from our server
	getNewData: function() {
		app.updatingGraphic( 'show' );
		
		$.ajax({
			async: false,
			type: "GET",
			url: "http://schedule.aaronvanderzwan.com",
			jsonp: "callback",
			dataType: "jsonp",
			data: {
				type: "json"
			},
			success: function (data, textStatus, jqXHR) {
				// Give the appearance this takes a couple of seconds
				setTimeout(function(){
					app.updatingGraphic( 'hide' );
					
					// Deal with new data
					$.each(data.schedules, function (i, obj) {
						var str = '<div data-role="page" id="page' + i + '">' +
						'<div data-role="header">' +
							'<h1>' + obj.title + '</h1>' +
						'</div><!-- /header -->' +

						'<div role="main" class="ui-content">' +
							obj.content +
							obj.original.length > 0 ? '<a href="' + obj.original + '" target="_blank">Original PDF</a>' : '' +
						'</div><!-- /content -->' +

						'<div data-role="footer">' +
							'<h4>Page Footer</h4>' +
						'</div><!-- /footer -->' +
						'</div>';
						
						
						$('#loaded').append( str );
					});
				}, 2000);
				
			},
			error: function () {
				app.updatingGraphic( 'error' );
			}
		});
	},
	
	// Show / hide updating graphic
	updatingGraphic: function( w ) {
		
		var $updating = $('.updatingGraphic'),
			$error = $('.errorGraphic');
		
		
		if( 'show' == w ) {
			$updating.slideDown();
		} else if( 'hide' == w ) {
			$updating.slideUp();
		} else if( 'error' == w ) {
			$updating.slideUp();
			
			// Show error for a few seconds
			$error.slideDown();
			setTimeout(function(){
				$error.slideUp();
			}, 4000);
		}
	}
};
