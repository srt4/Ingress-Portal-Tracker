var http = require('http');

function Passcode() {
	this.code = '';
	this.used = false;
}

Passcode.prototype.getCode = function() {
	return this.code;
}
Passcode.prototype.setCode = function(code) {
	this.code = code;
}

Passcode.prototype.isUsed = function() {
	return this.used;
}
Passcode.prototype.setUsed = function(used) {
	this.used = used;
}

Passcode.fetchAll = function(callback) {
	
	//Max age
	var checkHours = 3;
	
	//Regexes
	var regEx = {
        lettersAndNumbers: /[a-z0-9]{6,}/gmi,
        letters: /[a-z]/i,
        numbers: /[0-9]/
    };
	
	//The url we want is: 'www.random.org/integers/?num=1&min=1&max=10&col=1&base=10&format=plain&rnd=new'
	var options = {
		host:   'www.reddit.com',
		path:   '/r/Ingress/search.json?q=passcode&sort=new&restrict_sr=o',
		method: 'GET',
		agent: false
	};
	
	//Create request
	var request = http.request(options, function(response) {
		
		var body = '';

		//another chunk of data has been recieved, so append it to `str`
		response.on('data', function (chunk) {
			body += chunk;
		});

		//the whole response has been recieved, so we just print it out here
		response.on('end', function () {
			var json = JSON.parse(body);
			
			var passcodes = []
			
			json.data.children.forEach(function(post){
				post = post.data;
				
				//Check if too old
				if (new Date().getTime() - post.created_utc > (checkHours * 3600)) {
                    return;
				}
				
				//Search for the code
				var searchText = post.title + " " + post.selftext
				
				//Passcode
				var passcode = regEx.lettersAndNumbers.exec(searchText);
				if (!passcode) {
					return;
				}
				passcode = passcode[0];
				
				//Check again
				if ((regEx.numbers.test(passcode) && regEx.letters.test(passcode))) {
					passcodes.push(passcode);
				}
				
			});
			
			callback(passcodes);
		});
	});

	request.on("error", function(error){
		console.error("Error: ", error.stack);
	});
	
	request.end();
	
}


module.exports = Passcode;