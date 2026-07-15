import type { IOrder } from "../types"
import { useEffect } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import "leaflet-routing-machine"

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

const homeIcon = new L.DivIcon({
    html: "🏠",
    iconSize: [30, 30],
    className: "",
})

interface Props {
    order: IOrder;
    riderLocation: [number, number];
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
            show: false,
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

// Map ke center ko rider ki naye location par recenter karne ke liye
const RecenterMap = ({ position }: { position: [number, number] }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position);
    }, [position, map]);
    return null;
}

const MapforUser = ({ order, riderLocation }: Props) => {
    if (order.deliveryAddress.latitude == null || order.deliveryAddress.longitude == null) {
        return null;
    }

    const deliveryLocation: [number, number] = [
        order.deliveryAddress.latitude,
        order.deliveryAddress.longitude
    ];

    return (
        <div className="rounded-xl overflow-hidden rider-map-wrapper">
            <style>{`
                .rider-map-wrapper .leaflet-routing-container {
                    display: none !important;
                }
            `}</style>

            <MapContainer center={riderLocation} zoom={15} style={{ height: "350px", width: "100%" }}>
                <TileLayer
                    attribution="&copy; OpenStreetMap"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Rider ki current location */}
                <Marker position={riderLocation} icon={riderIcon}>
                    <Popup>{order.riderName || "Your rider"}</Popup>
                </Marker>

                {/* Delivery address */}
                <Marker position={deliveryLocation} icon={homeIcon}>
                    <Popup>Delivery Location</Popup>
                </Marker>

                {/* Route rider se delivery address tak */}
                <Routing from={riderLocation} to={deliveryLocation} />

                {/* Jab rider ki location update ho, map usko follow kare */}
                <RecenterMap position={riderLocation} />
            </MapContainer>
        </div>
    )
}

export default MapforUser