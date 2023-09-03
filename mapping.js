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

function loadLines() {
	const maxCount = Math.max.apply(Math, Object.values(journeys));
	const minCount = Math.min.apply(Math, Object.values(journeys));
	
	const minWeight = 5;
	const maxWeight = 20;

	// order the journeys by count
	const orderedJourneys = {};
	Object.keys(journeys).sort(function(a,b){return journeys[b]-journeys[a]}).forEach(function(key) {
		orderedJourneys[key] = journeys[key];
	});

	document.getElementById("leaderboard-container").style.display = "block";
	
	// read the journeys!
	for (const j in orderedJourneys) {
		const crs = j;
		const count = journeys[j];

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
			const calculatedOpacity = convertRange(count, [minCount, maxCount], [0.25, 0.99]);
			const calculatedBrightness = convertRange(count, [minCount, maxCount], [90, 0]);

			console.log(originCoords, destCoords, calculatedWeight);

			const line = L.polyline([originCoords, destCoords], {
				color: `hsl(0, 100%, ${calculatedBrightness}%)`,
				weight: calculatedWeight,
				opacity: calculatedOpacity
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

// https://stackoverflow.com/a/14224813
function convertRange(value, r1, r2) {
	const result = (value - r1[0]) * (r2[1] - r2[0]) / (r1[1] - r1[0]) + r2[0];
	console.log(value, r1, r2, result);
	return result;
}