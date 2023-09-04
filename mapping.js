// get the map going
let map = L.map("map", {
	center: [52.437, -1.649],
	zoom: 6
});

// L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
// 	maxZoom: 19,
// 	attribution: '© OpenStreetMap'
// }).addTo(map);

L.tileLayer('https://basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png', { attribution: `Tiles by <a href="https://carto.com/">Carto</a>` }).addTo(map);

function loadJourneyLines() {
	const maxCount = Math.max.apply(Math, Object.values(journeyCounts));
	const minCount = Math.min.apply(Math, Object.values(journeyCounts));
	
	const minWeight = 5;
	const maxWeight = 25;

	// order the journeyCounts by count
	const orderedjourneyCounts = {};
	Object.keys(journeyCounts).sort(function(a,b){return journeyCounts[b]-journeyCounts[a]}).forEach(function(key) {
		orderedjourneyCounts[key] = journeyCounts[key];
	});

	document.getElementById("leaderboard-container").style.display = "block";
	
	// read the journeyCounts!
	for (const j in orderedjourneyCounts) {
		const crs = j;
		const count = journeyCounts[j];

		const origin = crs.substring(0, 3);
		const dest = crs.substring(3, 6);

		const originObj = stations.find(s => s.crsCode == origin);
		const destObj = stations.find(s => s.crsCode == dest);

		console.log("=====");
		console.log(origin, dest, count);
		console.log(originObj, destObj);

		if(originObj && destObj) {
			
			const originCoords = [originObj.lat, originObj.long];
			const destCoords = [destObj.lat, destObj.long];

			const calculatedWeight = convertRange(count, [minCount, maxCount], [minWeight, maxWeight]);
			const calculatedHue = convertRange(count, [minCount, maxCount], [0, 100]);

			console.log(originCoords, destCoords, calculatedWeight);

			const line = L.polyline([originCoords, destCoords], {
				color: `hsl(${calculatedHue}, 100%, 30%)`,
				weight: calculatedWeight,
				opacity: 0.8
			}).addTo(map).bindPopup(`${originObj.stationName} to ${destObj.stationName} (${count})`);


			document.getElementById("leaderboard").innerHTML += `
			<li onclick="map.setView([${originObj.lat},${originObj.long}],12);">
				<span class="origin">${originObj.stationName}</span>
				<span class="to">to</span>
				<span class="dest">${destObj.stationName}</span>
				<span class="count">${count}</span>
				</li>
			`;
		}
	}
}

function loadStationDots() {
	const maxCount = Math.max.apply(Math, Object.values(stationCounts));
	const minCount = Math.min.apply(Math, Object.values(stationCounts));

	const minWeight = 5;
	const maxWeight = 25;

	for (const s in stationCounts) {
		const crs = s;
		const count = stationCounts[s];
		
		const stn = stations.find(sInList => sInList.crsCode == crs);

		const coords = [stn.lat, stn.long];

		L.circle(coords, {
			color: "white",
			weight: 1,
			fillColor: "white",
			fillOpacity: 0.8,
			radius: convertRange(count, [minCount, maxCount], [50, 500])
		}).addTo(map).bindPopup(`${stn.stationName} (${count})`);
	}
}

// https://stackoverflow.com/a/14224813
function convertRange(value, r1, r2) {
	const result = (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
	console.log(value, r1, r2, result);
	return result;
}