let journeys = {};

function parseCSV(csv) {
	const lines = csv.split("\n");

	for(const l in lines) {
		const line = lines[l];
		
		// skip empty lines
		if(line == "") continue;
		// skip header
		if(l == 0) continue;

		const cols = line.split(",");
		const origin = cols[2];
		const dest = cols[6];

		console.log("=====");
		console.log(origin, dest);

		const originObj = stations.find(s => cleaner(s.stationName) == cleaner(origin));
		const destObj = stations.find(s => cleaner(s.stationName) == cleaner(dest));
		
		console.log(originObj, destObj);

		if(originObj && destObj) {
			const crs = `${originObj.crsCode}${destObj.crsCode}`;
			if(journeys[crs] == undefined) {
				journeys[crs] = 1;
			} else {
				journeys[crs] = journeys[crs] + 1;
			}
		}
	}

	console.log(journeys);
	loadLines();
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