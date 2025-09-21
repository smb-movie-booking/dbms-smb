import {
  AdminDashboard,
  AddCity,
  AddCinema,
  AddCinemaHall,
  AddSeats,
  AddMovie,
  AddShow,
  ViewCities,
  ViewCinemas,
  ViewMovies,
  ViewShows,
  ViewCinemaHalls
} from "../pages/Admin";

export const adminRoutes = [
  { path: "/admin", element: <AdminDashboard /> },
  { path: "/admin/add-city", element: <AddCity /> },
  { path: "/admin/add-cinema", element: <AddCinema /> },
  { path: "/admin/add-hall", element: <AddCinemaHall /> },
  { path: "/admin/add-seats", element: <AddSeats /> },
  { path: "/admin/add-movie", element: <AddMovie /> },
  { path: "/admin/add-show", element: <AddShow /> },
  { path: "/admin/view-cities", element: <ViewCities /> },
  { path: "/admin/view-cinemas", element: <ViewCinemas /> },
  { path: "/admin/view-movies", element: <ViewMovies /> },
  { path: "/admin/view-shows", element: <ViewShows /> },
  { path: "/admin/view-halls", element: <ViewCinemaHalls /> },
];
