"use client"
import { useState } from "react";
import {getDatabase, child, get, off, ref } from "firebase/database";
import type { IDriversData, ButtonDriversType } from "@/types/drivers";
import { useMap } from "@vis.gl/react-google-maps";

function cleanPhoneNumber(phoneNumber: string): string {
	// Удаляем все символы, кроме цифр
	let cleanedNumber = phoneNumber.replace(/\D/g, '');
	// Возвращаем строку, начиная со второго символа
	return cleanedNumber.substring(1);
}

function SearchPhone(
	{setData, currentRef, currentType}: 
	{setData:Function, currentRef:any, currentType:ButtonDriversType}) {
	const map = useMap();
	const dbRef = ref(getDatabase());
	const [phone, setPhone] = useState<string>('');

	const sendPhone = () => {
		if(!map) return;
		off(currentRef);
		get(child(dbRef, 'Drivers'))
		.then((snapshot) => {
			const data = snapshot.val();
			//console.log(data);
			const dataArr = Object.values(data);
			const item = dataArr.find((item: any) => cleanPhoneNumber(item.phone) === cleanPhoneNumber(phone)) as IDriversData;
			if(item) {
				
				if(!item.state){
					alert('Водитель не в сети');
					return;
				}
				
				if(item.carCurrent !== currentType){
					alert('Водитель в группе ' + item.carType);
					return;
				} 

				setData([item]);
				map.setCenter({lat: item.lat, lng: item.lon});
				map.setZoom(16);
			}else{
				alert('Не зарегистрирован');
			}

			setPhone('');
		}).catch((error) => {
			console.error(error);
		});
	}

	return ( 
		<div className='flex items-center gap-x-5'>
			<input
				value={phone}
				onChange={(e) => setPhone(e.target.value)} 
				type='text' 
				className='input' 
				placeholder='Поиск по тел' 
			/>
			<button onClick={e => {
				if(phone === '') return;
				sendPhone();
			}} className='btn_secondary'>Поиск</button>
		</div>
	);
}

export default SearchPhone;