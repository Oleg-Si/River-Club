import {Loader} from '@googlemaps/js-api-loader';

interface Position {
  lat: number,
  lng: number
}

interface Marker {
  position: Position,
  icon: string,
  iconActive?: string,
  id?: number
}

const markers: Array<Marker> = [
  {
    position: { lat: 52.13972141945028, lng: 28.479839203280058 },
    icon: '../img/icons/icon-house.svg',
    iconActive: '../img/icons/icon-house-active.svg',
    id: 1
  },
  {
    position: { lat: 52.10337061507618, lng: 28.41296106442977 },
    icon: '../img/icons/icon-tree.svg',
    iconActive: '../img/icons/icon-tree-active.svg',
    id: 3
  },
  {
    position: { lat: 52.06608671469126, lng: 28.47854839638568 },
    icon: '../img/icons/icon-shotgun.svg',
    iconActive: '../img/icons/icon-shotgun-active.svg',
    id: 4
  },
  {
    position: { lat: 52.13125909774229, lng: 28.32765594094968 },
    icon: '../img/icons/icon-ship.svg',
    iconActive: '../img/icons/icon-ship-active.svg',
    id: 2
  },
  {
    position: { lat: 52.07471881858681, lng: 28.282086764444003 },
    icon: '../img/icons/icon-house.svg',
    iconActive: '../img/icons/icon-house-active.svg',
    id: 5
  }
]

// Создает маркеры
const createToursMarkers = (map: google.maps.Map, markers: Marker[] | Marker): void => {
  if (Array.isArray(markers)) {
    markers.forEach((el: Marker) => {
      const marker = new google.maps.Marker({
        position: el.position,
        map,
        icon: el.icon,
        animation: google.maps.Animation.DROP,
      })

      if (el.iconActive) {
        marker.addListener('mouseover', () => {
          marker.setIcon(el.iconActive);
        })
        marker.addListener('mouseout', () => {
          marker.setIcon(el.icon);
        })
      }

      if (el.id) {
        marker.addListener('click', () => {
          tourMarkerClickHandler(el.id);
        });
      }
    });
  } else {
    const marker = new google.maps.Marker({
      position: markers.position,
      map,
      icon: markers.icon,
      animation: google.maps.Animation.DROP,
    });

    if (markers.iconActive) {
      marker.addListener('mouseover', () => {
        marker.setIcon(markers.iconActive)
      })
      marker.addListener('mouseout', () => {
        marker.setIcon(markers.icon)
      })
    }
  }
};

const tourMarkerClickHandler = (tourId: number): void => {
  const descriptions = document.querySelectorAll('.tours__description');

  descriptions.forEach((el) => {
    el.classList.remove('tours__description_active');
  })

  const newActiveTour = document.querySelector(`.tours__description[data-id="${tourId}"]`);
  newActiveTour.classList.add('tours__description_active');
}

const loader = new Loader({
  apiKey: "AIzaSyB3d3aH8RdWGZOehp0HinVIy5IGDIQstlA",
  version: "weekly"
});

loader.load().then(() => {

  // Создаем карту в блоке "контакты"
  const contactsMap: google.maps.Map = new google.maps.Map(document.querySelector('.contacts__map') as HTMLElement, {
    center: { lat: 52.140660142274896, lng: 28.614480403375104 },
    zoom: 13,
    mapTypeId: 'hybrid',
    disableDefaultUI: true
  });

  // Ставим маркер
  const marker: Marker = {
    position: { lat: 52.140660142274896, lng: 28.614480403375104 },
    icon: '../img/icons/icon-geo.svg'
  }

  createToursMarkers(contactsMap, marker);

  // Создаем карту в блоке "экскурсии"
  const toursMap = new google.maps.Map(document.querySelector('.tours__map'), {
    center: { lat:52.11512643658192, lng: 28.411603644544563 },
    zoom: 11,
    mapTypeId: 'hybrid',
    disableDefaultUI: true
  });

  // Создаем маркеры в блоке "экскурсии"
  createToursMarkers(toursMap, markers);
});
