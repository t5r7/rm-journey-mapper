let journeyCounts = {};
let stationCounts = {};
let lines = undefined;

function parseCSV(csv) {
	lines = csv.split("\n");

	loopOverLines(0);

	if(document.getElementById("starts-with").checked) loopOverLines(1);
	
	loadJourneyLines();
	loadStationDots();
}

function loopOverLines(pass) {
	// pass:
	// 0 = match names exactly
	// 1 = match names using starts with

	for (const l in lines) {
		const line = lines[l];

		// skip empty lines
		if (line == "") continue;
		// skip header
		if (l == 0) continue;

		const cols = line.split(",");
		
		// remove if not mainline rail journey
		if(cols[19] !== '""') { // RM turns "0" into "" for some reason
			lines[l] = "";
			continue;
		};

		// eval removes the quotes around the string so "station" becomes station
		let origin = String(eval(cols[2]));
		let dest = String(eval(cols[6]));

		// replace "edinburgh" with "edinburgh waverley," and "university," with "university (birmingham)"
		// should not just be a list of replacements, but I'm lazy and it works for now
		if (origin == "Edinburgh") origin = "Edinburgh Waverley";
		if (origin == "University") origin = "University (Birmingham)";
		if (dest == "Edinburgh") dest = "Edinburgh Waverley";
		if (dest == "University") dest = "University (Birmingham)";

		console.log("=====");
		console.log(origin, dest);

		let originObj = undefined;
		let destObj = undefined;

		if (pass == 0) {
			originObj = stations.find(s => cleaner(s.stationName) == cleaner(origin));
			destObj = stations.find(s => cleaner(s.stationName) == cleaner(dest));
		} else if (pass == 1) {
			originObj = stations.find(s => cleaner(s.stationName).startsWith(cleaner(origin)));
			destObj = stations.find(s => cleaner(s.stationName).startsWith(cleaner(dest)));
		}

		console.log(originObj, destObj);

		if (originObj && destObj) { 
			const crs = `${originObj.crsCode}${destObj.crsCode}`;
			if (journeyCounts[crs] == undefined) {
				journeyCounts[crs] = 1;
			} else {
				journeyCounts[crs] = journeyCounts[crs] + 1;
			}

			if (stationCounts[originObj.crsCode] == undefined) {
				stationCounts[originObj.crsCode] = 1;
			} else {
				stationCounts[originObj.crsCode] = stationCounts[originObj.crsCode] + 1;
			}

			if (stationCounts[destObj.crsCode] == undefined) {
				stationCounts[destObj.crsCode] = 1;
			} else {
				stationCounts[destObj.crsCode] = stationCounts[destObj.crsCode] + 1;
			}

			// remove line from csv if dealt with
			lines[l] = "";
		}
	}

	console.table(lines);
}

function cleaner(text) {
	let cleaned = text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
	return cleaned;
}

//  0 "rm_product_type"
//  1 "origin_id"
//  2 "origin_name"
//  3 "origin_tz"
//  4 "origin_platform"
//  5 "destination_id"
//  6 "destination_name"
//  7 "destination_tz"
//  8 "destination_platform"
//  9 "time_departure_act"
// 10 "time_departure_plan"
// 11 "time_arrival_act"
// 12 "time_arrival_plan"
// 13 "operator_code"
// 14 "operator_name"
// 15 "distance_miles"
// 16 "route"
// 17 "identity"
// 18 "hidden_type"
// 19 "vehicle_type"
// 20" inserted"
// 21 "updated"
// 22 "source"
// 23 "notes"
// 24 "vehicles"