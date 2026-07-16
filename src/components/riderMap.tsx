import type { IOrder } from "../types"
import { useState, useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"
import { RealtimeService } from "../main"
import axios from "axios"

declare module "leaflet" {
    namespace Routing {
        function control(options: any): any;
        function osrmv1(options: any): any;
    }
}

const riderIcon = new L.DivIcon({
    html: "🚴",
    iconSize: [30, 30],
    className: "",
})

interface prop {
    order: IOrder
}

const Routing = ({
    from,
    to,
}: {
    from: [number, number],
    to: [number, number]
}) => {
    const map = useMap();
    useEffect(() => {
        const control = L.Routing.control({
            waypoints: [L.latLng(from), L.latLng(to)],
            lineOptions: {
                styles: [{ color: "#E23744", weight: 5 }]
            },
            addWaypoints: false,
            draggableWaypoints: false,
            show: true,
            createMarker: () => null,
            router: L.Routing.osrmv1({
                serviceUrl: "https://router.project-osrm.org/route/v1"
            })
        }).addTo(map);

        return () => {
            map.removeControl(control);
        }
    }, [from, to, map])
    return null
}

const RiderMap = ({ order }: prop) => {
    const [riderLocation, setRiderLocation] = useState<[number, number] | null>(null);

    if (order.deliveryAddress.latitude == null || order.deliveryAddress.longitude === null) {
        return null;
    }

    const deliveryLocation: [number, number] = [order.deliveryAddress.latitude, order.deliveryAddress.longitude]

    useEffect(() => {
        const fetchLocation = () => {
            navigator.geolocation.getCurrentPosition((pos) => {
                const latitude = pos.coords.latitude;
                const longitude = pos.coords.longitude;

                setRiderLocation([latitude, longitude])
console.log("KEY:", import.meta.env.VITE_INTERNAL_SERVICE_KEY)
                axios.post(`${RealtimeService}/api/v1/internal/emit`, {
                    event: "rider:location",
                    room: `user:${order.userId}`,
                    payload: { latitude, longitude }
                }, {
                    headers: {
                        "x-internal-key": import.meta.env.VITE_INTERNAL_SERVICE_KEY
                    }
                }
                )
            }, (error: unknown) => console.log(error),

                {
                    enableHighAccuracy: true,
                    maximumAge: 5000,
                    timeout: 10000
                }
            )
        }

        fetchLocation();

        const interval = setInterval(fetchLocation, 10000);
        return () => clearInterval(interval);
    }, [order.userId])

    if (!riderLocation) return null;

    return (
        <div className="rounded-xl bg-white rider-map-wrapper">
            {/* Ye style tag routing panel ko chota box bana ke top-right mein fix kar deta hai */}
            <style>{`
                .rider-map-wrapper {
                    position: relative;
                }
                .rider-map-wrapper .leaflet-routing-container {
                    position: absolute !important;
                    top: 10px;
                    right: 10px;
                    left: auto !important;
                    width: 160px;
                    max-height: 120px;
                    overflow-y: auto;
                    z-index: 1000;
                    background: white;
                    border-radius: 6px;
                    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
                    padding: 6px;
                    font-size: 10px;
                    line-height: 1.3;
                }
                .rider-map-wrapper .leaflet-routing-alt {
                    max-height: 90px;
                    overflow-y: auto;
                    width: 100% !important;
                }
                .rider-map-wrapper .leaflet-routing-container table {
                    width: 100%;
                }
                .rider-map-wrapper .leaflet-routing-container h2 {
                    font-size: 10px;
                    margin: 2px 0;
                }
                .rider-map-wrapper .leaflet-routing-container h3 {
                    display: none;
                }
                .rider-map-wrapper .leaflet-routing-container td {
                    padding: 1px 2px;
                }
            `}</style>

            <MapContainer center={riderLocation} zoom={15} style={{ height: "400px", width: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={riderLocation} icon={riderIcon}>
                    <Popup>Rider is here</Popup>
                </Marker>
                <Routing from={riderLocation} to={deliveryLocation} />
            </MapContainer>
        </div>
    )
}

export default RiderMap