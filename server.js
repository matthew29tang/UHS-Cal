var port = process.env.PORT || 8888; //sets local server port to 8888
var express = require('express'); // Express web server framework
var request = require('request');
var JSSoup = require('jssoup').default;
var token = null;

var redirect_uri = 'http://localhost:8888'; // Your redirect uri in case you are using apis
var app = express();

app.get('/getCalendar', function(req, res) {
    
    
	function getCalendar(callback){
		var options = {
			url: 'https://uhs.berkeley.edu/calendar',
			method: 'GET'
		};
		request(options, (error, response, body) => {
			if (!error && response.statusCode == 200) {
				var soup = new JSSoup(body);
				var c1 = new JSSoup(soup.findAll('div', { 'class': 'field-item' })[12].contents);
				var c2 = new JSSoup(soup.findAll('div', { 'class': 'field-item' })[13].contents);
				//Extract events frome each column, concatenate to make 1 list of events
				var events = parseRawEvents(c1.contents[0]).slice(1).concat(parseRawEvents(c2.contents[0]).slice(1));
				console.log(eventsToJson(events));
				callback(eventsToJson(events));
				//makeCall(info.access_token, path, params, callback);
			}
		});
	}
	
	function eventsToJson(events){
		json_events = [];
		for (var i in events){
			ev = events[i]
			json_event = {};
			var date = ev.split("-")[0];
			json_event.day = date.split(", ")[0];
			json_event.date = date.split(", ")[1].trim();
			var info = ev.split("-").splice(1).join("-").split(",").map(el => el.trim()).filter(Boolean)
			while (analyzeString(info[0]) === "daydate")
				info = info.splice(1)
			json_event.desc = info[0];
			json_event.place_time = info.splice(1).join(" ")	
			if (json_event.date === "December 15 &amp; Sunday")
				return json_events
			json_events.push(json_event);
		}
		return json_events
	}
	
	function analyzeString(str){
		var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		var res = ""
		if (!str)
			return null
			
		for (var i in days){
			if (str.search(days[i]) > -1)
				res += "day"
		}
		
		var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
		for (var i in months){
			if (str.search(months[i]) > -1 && str.search(months[i]) < 5)
				res += "date"
		}
		return res
	}
	
	function parseRawEvents(raw_events){
		var events = [];
		var ev = [];
		var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
		while (raw_events){
			if (raw_events._text && days.indexOf(raw_events._text.split(",")[0]) > -1){
				events.push(ev);
				ev = [];
				ev.push(raw_events._text);
			}
			else if (raw_events._text)
				ev.push(raw_events._text);
			raw_events = raw_events.nextElement;
		}
		if (ev)
			events.push(ev);
		return events.map( ev => ev.join());
	}
	getCalendar(obj => res.send(obj))
	
})

app.listen(port, function() {}); //starts the server, alternatively you can use app.listen(port)