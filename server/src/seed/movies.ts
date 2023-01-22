import db from "../db/index.js";
import { watchMovie } from "../userMovie/watch.js";

const { id: userId } = await db.user.upsert({
  create: {
    username: "sirbranedamuj",
  },
  where: {
    username: "sirbranedamuj",
  },
  update: {},
});

const moviesToLoad = [
  "2164", // stargate
  "1091", // the thing
  "11013", // secretary
  "283995", // guardians of the galaxy 2
  "2024", // the patriot
  "155", // the dark knight
  "272", // batman begins
  "49026", // the dark knight rises
  "1359", // american psycho
  "27205", // inception
  "157336", // interstellar
  "438631", // dune ( D U N C )
];

console.log(`Loading ${moviesToLoad.length} movies...`);

await Promise.all(moviesToLoad.map((tmdbId) => watchMovie(userId, tmdbId)));

console.log("Finished!");
