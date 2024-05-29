"use client"
import { useEffect, useState } from "react";
import {useMap, useMapsLibrary} from '@vis.gl/react-google-maps';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import {
	Combobox,
	ComboboxInput,
	ComboboxPopover,
	ComboboxList,
	ComboboxOption,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

function SearchCity() {
	const map = useMap();
	const placesLib = useMapsLibrary("places");
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		if(!map || !placesLib) return;

		setIsLoading(false);
	});

	return ( 
		<div className='flex items-center gap-x-5'>
			{!isLoading && <Input />}
		</div>
	);
}

const Input = () => {
	const map = useMap();

	const {
		ready,
		value,
		suggestions: {status, data},
		setValue,
		clearSuggestions,
	} = usePlacesAutocomplete();

	const handleSelect = async (address: string) => {
		if(!map) return;
		setValue(address, false);
		clearSuggestions();

		try {
			const results = await getGeocode({address});
			const {lat, lng} = getLatLng(results[0]);
			map.setCenter({lat:lat, lng:lng});
			map.setZoom(10);
		} catch (error) {
			console.log(error);
		}
	}

	return (
		<Combobox onSelect={handleSelect}>
			<ComboboxInput 
				value={value} 
				onChange={e => setValue(e.target.value)} 
				disabled={!ready} 
				className='input'
				placeholder='Поиск по карте'
			/>
			<ComboboxPopover>
				<ComboboxList>
					{status === 'OK' && data.map(({place_id, description}) => (
						<ComboboxOption key={place_id} value={description} className='option' />
					))}
				</ComboboxList>
			</ComboboxPopover>
		</Combobox>
	)
}

export default SearchCity;