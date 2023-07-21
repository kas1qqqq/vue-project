<script>
import { onMounted } from "vue";
import leaflet from "leaflet";

export default {
  name: "MapView",
  setup() {
    let map;
    let marker;
    let coordinatesX;
    let coordinatesY;
    let arrOfCoords = [];
    let getArrOfCoords;
    let previousMarkers;

    onMounted(() => {
      map = leaflet.map("map").setView([49, 32], 5);

      leaflet
        .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
          maxZoom: 19,
          attribution:
            '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        })
        .addTo(map);

      getArrOfCoords = JSON.parse(localStorage.getItem("Coordinates"));

      if (getArrOfCoords) {
        for (let n in getArrOfCoords) {
          previousMarkers = L.marker(getArrOfCoords[n], {
            opacity: 0.7,
          })
            .bindTooltip(
              `<div class="wrapper-coord"><span class="marker-title">My previous marker</span><span>Latitude: <span class="coord">${getArrOfCoords[
                n
              ].at(
                -2
              )}</span></span><span>Longitude: <span class="coord">${getArrOfCoords[
                n
              ].at(-1)}</span></div>`
            )
            .addTo(map);
          previousMarkers._icon.classList.add("previous-marker-hue");
        }

        if (getArrOfCoords.length === 1) {
          localStorage.clear();
        }
      }

      function onMapClick(e) {
        coordinatesX = [e.latlng.lat.toFixed(3)];
        coordinatesY = [e.latlng.lng.toFixed(3)];
        marker = L.marker(e.latlng).addTo(map);

        marker
          .bindPopup(
            `<div class="wrapper-coord"><span class="marker-title">My new marker</span><span>Latitude: <span class="coord">${coordinatesX}</span></span><span>Longitude: <span class="coord">${coordinatesY}</span></div>`
          )
          .openPopup();

        arrOfCoords.push([...coordinatesX, ...coordinatesY]);
        localStorage.setItem("Coordinates", JSON.stringify(arrOfCoords));
      }
      map.on("click", onMapClick);
    });
  },
};
</script>

<template>
  <main>
    <div class="notif">
      <p>If you leave one point, the local storage will be cleared.</p>
    </div>

    <div id="map"></div>
  </main>
</template>

<style>
.notif {
  margin-top: -1rem;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  color: rgba(250, 250, 210, 0.3);
  user-select: none;
  animation-name: notif;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes notif {
  0% {
    opacity: 0.6;
  }
  25% {
    opacity: 1;
    filter: brightness(1.1);
  }
  50% {
    opacity: 0.6;
  }
  75% {
    opacity: 1;
    filter: brightness(1.1);
  }
  100% {
    opacity: 0.6;
  }
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

#map {
  margin: 0 auto;
  height: 440px;
  width: 80%;
  border-radius: 0.2rem;
}

.previous-marker-hue {
  filter: hue-rotate(145deg);
}

.wrapper-coord {
  display: flex;
  align-items: center;
  flex-direction: column;
}

.marker-title {
  font-style: italic;
  margin-bottom: 0.2rem;
}

.coord {
  font-weight: bold;
}

@media (max-width: 640px) {
  #map {
    width: 100%;
  }
}
</style>
