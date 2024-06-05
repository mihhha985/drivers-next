"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { IDriversData, ButtonDriversType} from '@/types/drivers';
import { Point } from "@/types/map";
import {Map, AdvancedMarker, InfoWindow, useMap} from '@vis.gl/react-google-maps';

const defaultCenter = {
  lat: 56.0527153,
	lng: 92.7502487
};

const getMarker = (marker: IDriversData):string => {
	let path: string = '/';
	marker.state === 'Free' ? path += 'freecar/' : path += 'busycar/';
	path += `${marker.weight}.png`;
	return path;
}

const MapComponent = ({data, type}: {data:IDriversData[]|null, type:ButtonDriversType}) => {
	const map = useMap();
	const [open, setOpen] = useState<boolean>(false);
	const [position, setPosition] = useState<Point>({lat: 0, lng: 0});
	const [phone, setPhone] = useState<string>('');
	const [name, setName] = useState<string>('');
	const [also, setAlso] = useState<string>('');

	useEffect(() => {
		if(!map) return;
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(function(position) {
				const lat = position.coords.latitude;
				const lng = position.coords.longitude;
				console.log({lat: lat, lng: lng});
				map.setCenter({lat: lat, lng: lng});
			});

		} else {
			console.log("Geolocation не поддерживается вашим браузером.");
		}

		return () => {	
			handleClose();
		}
		
	}, [map]);

	useEffect(() => {
		return () => {	
			handleClose();
		}
	}, [type]);


	const handleOpen = (lat: number, lng: number, phone:string, name:string, also:string) => {
		if(!lat || !lng || !phone || !name) return;
		setPosition({lat, lng});
		setPhone(phone);
		setName(name);
		setAlso(also);
		setOpen(true);
	}

	const handleClose = () => {
		setOpen(false);
		setPosition({lat: 0, lng: 0});
		setPhone('');
		setName('');
		setAlso('');
	}

	return (
		<div className='row-span-11 col-span-9'>
			<Map
				style={{width: '100%', height: '100%'}}
				defaultCenter={defaultCenter}
				defaultZoom={12}
				mapId={`${process.env.googleMapId}`}
				fullscreenControl={false}
			>
				{data && data.map((marker, index) => {

					if(!marker.lat || !marker.lon) return null;
					
					return (
						<AdvancedMarker 
							key={index}
							onClick={() => handleOpen(marker.lat, marker.lon, marker.phone, marker.name, marker.also)}	
							position={{lat: marker.lat, lng: marker.lon}}>
							<Image src={getMarker(marker)} width={60} height={60} alt="marker" />
						</AdvancedMarker>
					);
				})}

				{open && 
					<InfoWindow
						position={position}
						onClose={handleClose}>
						<div className='text-lg'>
							<div><b>Имя: </b> {name}</div>
							<div><b>Телефон: </b> {phone}</div>
							<div><b>Оборудование: </b> {also}</div>
						</div>
					</InfoWindow>
				}
			</Map>
  	</div>
	)
}

export default MapComponent;