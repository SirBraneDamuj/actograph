import { MovieDb } from "moviedb-promise";

export default new MovieDb(process.env.TMDB_API_KEY || (() => { throw new Error("TMDB_API_KEY REQUIRED") })());
