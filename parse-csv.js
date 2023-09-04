let journeys = {};
let lines = undefined;

function parseCSV(csv) {
	lines = csv.split("\n");

	loopOverLines(0);
	// loopOverLines(1);
	
	loadLines();
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

		const origin = cols[2];
		const dest = cols[6];


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
			if (journeys[crs] == undefined) {
				journeys[crs] = 1;
			} else {
				journeys[crs] = journeys[crs] + 1;
			}

			// remove line from csv if dealt with
			lines[l] = "";
		}
	}

	console.table(lines);
}

function cleaner(text) {
	return text.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
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