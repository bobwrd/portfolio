import type { Port } from "./types.js";

/**
 * Bundled, curated list of historically relevant ports, hubs, and overland
 * caravan stops. `region` groups ports by ocean/sea basin or overland
 * corridor and drives the route guess's yellow ("right region, wrong port")
 * feedback. Coordinates are approximate (city-level), which is all the map
 * and distance/bearing math need.
 */
export const PORTS: Port[] = [
  // Mediterranean
  { id: "alexandria", name: "Alexandria", region: "Mediterranean", lat: 31.2, lon: 29.92 },
  { id: "ostia", name: "Ostia (Rome)", region: "Mediterranean", lat: 41.73, lon: 12.29 },
  { id: "puteoli", name: "Puteoli (Pozzuoli)", region: "Mediterranean", lat: 40.82, lon: 14.12 },
  { id: "carthage", name: "Carthage", region: "Mediterranean", lat: 36.85, lon: 10.32 },
  { id: "venice", name: "Venice", region: "Mediterranean", lat: 45.44, lon: 12.32 },
  { id: "genoa", name: "Genoa", region: "Mediterranean", lat: 44.41, lon: 8.93 },
  { id: "constantinople", name: "Constantinople", region: "Mediterranean", lat: 41.01, lon: 28.98 },
  { id: "piraeus", name: "Athens (Piraeus)", region: "Mediterranean", lat: 37.94, lon: 23.65 },
  { id: "marseille", name: "Marseille", region: "Mediterranean", lat: 43.3, lon: 5.37 },
  { id: "barcelona", name: "Barcelona", region: "Mediterranean", lat: 41.39, lon: 2.17 },
  { id: "tyre", name: "Tyre", region: "Mediterranean", lat: 33.27, lon: 35.2 },
  { id: "palermo", name: "Palermo", region: "Mediterranean", lat: 38.12, lon: 13.36 },
  { id: "tripoli", name: "Tripoli", region: "Mediterranean", lat: 32.89, lon: 13.19 },
  { id: "cairo", name: "Cairo", region: "Mediterranean", lat: 30.04, lon: 31.24 },

  // Atlantic
  { id: "lisbon", name: "Lisbon", region: "Atlantic", lat: 38.72, lon: -9.14 },
  { id: "cadiz", name: "Cadiz", region: "Atlantic", lat: 36.53, lon: -6.3 },
  { id: "bristol", name: "Bristol", region: "Atlantic", lat: 51.45, lon: -2.59 },
  { id: "liverpool", name: "Liverpool", region: "Atlantic", lat: 53.41, lon: -2.98 },
  { id: "nantes", name: "Nantes", region: "Atlantic", lat: 47.22, lon: -1.55 },
  { id: "bordeaux", name: "Bordeaux", region: "Atlantic", lat: 44.84, lon: -0.58 },
  { id: "recife", name: "Recife", region: "Atlantic", lat: -8.05, lon: -34.88 },
  { id: "salvador", name: "Salvador (Bahia)", region: "Atlantic", lat: -12.97, lon: -38.51 },
  { id: "bridgetown", name: "Bridgetown, Barbados", region: "Atlantic", lat: 13.1, lon: -59.62 },
  { id: "havana", name: "Havana", region: "Atlantic", lat: 23.13, lon: -82.38 },
  { id: "kingston", name: "Kingston, Jamaica", region: "Atlantic", lat: 17.97, lon: -76.79 },
  { id: "charleston", name: "Charleston", region: "Atlantic", lat: 32.78, lon: -79.93 },
  { id: "boston", name: "Boston", region: "Atlantic", lat: 42.36, lon: -71.06 },
  { id: "new-york", name: "New York", region: "Atlantic", lat: 40.71, lon: -74.01 },
  { id: "elmina", name: "Elmina (Gold Coast)", region: "Atlantic", lat: 5.08, lon: -1.35 },
  { id: "luanda", name: "Luanda", region: "Atlantic", lat: -8.84, lon: 13.23 },
  { id: "cape-town", name: "Cape Town", region: "Atlantic", lat: -33.92, lon: 18.42 },
  { id: "buenos-aires", name: "Buenos Aires", region: "Atlantic", lat: -34.6, lon: -58.38 },

  // North Sea
  { id: "london", name: "London", region: "North Sea", lat: 51.51, lon: -0.13 },
  { id: "bruges", name: "Bruges", region: "North Sea", lat: 51.21, lon: 3.22 },
  { id: "amsterdam", name: "Amsterdam", region: "North Sea", lat: 52.37, lon: 4.9 },
  { id: "hamburg", name: "Hamburg", region: "North Sea", lat: 53.55, lon: 9.99 },

  // Baltic
  { id: "lubeck", name: "Lübeck", region: "Baltic", lat: 53.87, lon: 10.68 },
  { id: "bergen", name: "Bergen", region: "Baltic", lat: 60.39, lon: 5.32 },
  { id: "visby", name: "Visby, Gotland", region: "Baltic", lat: 57.64, lon: 18.3 },
  { id: "novgorod", name: "Novgorod", region: "Baltic", lat: 58.52, lon: 31.28 },
  { id: "riga", name: "Riga", region: "Baltic", lat: 56.95, lon: 24.11 },
  { id: "gdansk", name: "Danzig (Gdańsk)", region: "Baltic", lat: 54.35, lon: 18.65 },

  // Black Sea
  { id: "caffa", name: "Caffa (Feodosia)", region: "Black Sea", lat: 45.03, lon: 35.38 },
  { id: "trebizond", name: "Trebizond", region: "Black Sea", lat: 41.0, lon: 39.72 },

  // Red Sea
  { id: "jeddah", name: "Jeddah", region: "Red Sea", lat: 21.49, lon: 39.19 },
  { id: "aden", name: "Aden", region: "Red Sea", lat: 12.78, lon: 45.02 },

  // Persian Gulf
  { id: "hormuz", name: "Hormuz", region: "Persian Gulf", lat: 27.09, lon: 56.45 },
  { id: "basra", name: "Basra", region: "Persian Gulf", lat: 30.51, lon: 47.78 },
  { id: "muscat", name: "Muscat", region: "Persian Gulf", lat: 23.61, lon: 58.59 },
  { id: "baghdad", name: "Baghdad", region: "Persian Gulf", lat: 33.32, lon: 44.36 },

  // Indian Ocean
  { id: "calicut", name: "Calicut (Kozhikode)", region: "Indian Ocean", lat: 11.26, lon: 75.78 },
  { id: "goa", name: "Goa", region: "Indian Ocean", lat: 15.3, lon: 74.12 },
  { id: "surat", name: "Surat", region: "Indian Ocean", lat: 21.17, lon: 72.83 },
  { id: "cochin", name: "Cochin", region: "Indian Ocean", lat: 9.93, lon: 76.26 },
  { id: "colombo", name: "Colombo", region: "Indian Ocean", lat: 6.93, lon: 79.85 },

  // Swahili Coast
  { id: "zanzibar", name: "Zanzibar", region: "Swahili Coast", lat: -6.16, lon: 39.2 },
  { id: "kilwa", name: "Kilwa", region: "Swahili Coast", lat: -8.98, lon: 39.51 },
  { id: "mombasa", name: "Mombasa", region: "Swahili Coast", lat: -4.04, lon: 39.67 },

  // South China Sea / East Asia
  { id: "malacca", name: "Malacca", region: "South China Sea", lat: 2.19, lon: 102.25 },
  { id: "batavia", name: "Batavia (Jakarta)", region: "South China Sea", lat: -6.21, lon: 106.85 },
  { id: "guangzhou", name: "Guangzhou (Canton)", region: "South China Sea", lat: 23.13, lon: 113.26 },
  { id: "macau", name: "Macau", region: "South China Sea", lat: 22.2, lon: 113.55 },
  { id: "xiamen", name: "Xiamen (Amoy)", region: "South China Sea", lat: 24.48, lon: 118.09 },
  { id: "manila", name: "Manila", region: "South China Sea", lat: 14.6, lon: 120.98 },
  { id: "nagasaki", name: "Nagasaki", region: "South China Sea", lat: 32.75, lon: 129.87 },

  // Pacific
  { id: "acapulco", name: "Acapulco", region: "Pacific", lat: 16.86, lon: -99.88 },

  // Silk Road / Central Asia (overland)
  { id: "changan", name: "Chang'an (Xi'an)", region: "Silk Road / Central Asia", lat: 34.27, lon: 108.95 },
  { id: "dunhuang", name: "Dunhuang", region: "Silk Road / Central Asia", lat: 40.14, lon: 94.66 },
  { id: "kashgar", name: "Kashgar", region: "Silk Road / Central Asia", lat: 39.47, lon: 75.99 },
  { id: "khotan", name: "Khotan (Hotan)", region: "Silk Road / Central Asia", lat: 37.11, lon: 79.93 },
  { id: "samarkand", name: "Samarkand", region: "Silk Road / Central Asia", lat: 39.65, lon: 66.96 },
  { id: "bukhara", name: "Bukhara", region: "Silk Road / Central Asia", lat: 39.77, lon: 64.42 },
  { id: "merv", name: "Merv", region: "Silk Road / Central Asia", lat: 37.66, lon: 61.82 },

  // Sahara / West Africa (overland)
  { id: "timbuktu", name: "Timbuktu", region: "Sahara / West Africa", lat: 16.77, lon: -3.01 },
  { id: "gao", name: "Gao", region: "Sahara / West Africa", lat: 16.27, lon: -0.04 },
  { id: "sijilmasa", name: "Sijilmasa", region: "Sahara / West Africa", lat: 31.29, lon: -4.27 },
  { id: "taghaza", name: "Taghaza", region: "Sahara / West Africa", lat: 23.35, lon: -3.85 },
  { id: "fez", name: "Fez", region: "Sahara / West Africa", lat: 34.03, lon: -5.0 },
  { id: "marrakesh", name: "Marrakesh", region: "Sahara / West Africa", lat: 31.63, lon: -7.99 },
];

export function findPort(ports: Port[], id: string): Port | undefined {
  return ports.find((p) => p.id === id);
}

export function searchPorts(ports: Port[], query: string): Port[] {
  const q = query.trim().toLowerCase();
  if (!q) return ports;
  return ports.filter(
    (p) => p.name.toLowerCase().includes(q) || p.region.toLowerCase().includes(q),
  );
}
