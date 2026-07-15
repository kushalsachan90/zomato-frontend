

import { useSearchParams } from "react-router-dom";
import { AppData } from "../context/AppContext";
import { type IRestaurant } from "../types";
import { RestaurantService } from "../main";
import api from "../api/axios";
import { useEffect, useState } from "react";
import RestaurantCard from "../components/RestaurantCard";

const Home = () => {
  const { location } = AppData();
  console.log(location, "location in home");

  const [searchParams] = useSearchParams();
  const search = searchParams.get("search") || "";

  const [restaurant, setRestaurant] = useState<IRestaurant[]>([]);
  const [loading, setloading] = useState(true);

  const getDistanceKm = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371;

    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return +(R * c).toFixed(2);
  };

  const fetchRestaurants = async () => {
    try {
      if (!location?.latitude || !location?.longitude) {
        return;
      }

      setloading(true);

      const { data } = await api.get(
        `${RestaurantService}/api/restaurant/all`,
        {
          params: {
            latitude: location.latitude,
            longitude: location.longitude,
            search,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(data, "data");

      setRestaurant(data.restaurant ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, [location, search]);

  if (loading || !location) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="font-semibold text-gray-700">
          Finding Restaurant nearby you...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      {restaurant.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {restaurant.map((res) => {
            const [resLon, reslat] = res.autoLocation.coordinates;

            const distance = getDistanceKm(
              location.latitude,
              location.longitude,
              reslat,
              resLon
            );

            console.log(distance, "distance");

            return (
              <RestaurantCard
                key={res._id}
                id={res._id}
                name={res.name}
                image={res.image ?? ""}
                distance={`${distance}`}
                isOpen={res.isOpen}
              />
            );
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600">No restaurant found</p>
      )}
    </div>
  );
};

export default Home;