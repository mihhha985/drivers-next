"use client"
import Image from 'next/image';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from "firebase/database";
import { ButtonDriversType,	IDriversData } from '@/types/drivers';
import SearchPhone from '@/components/SearchPhone';
import { APIProvider } from '@vis.gl/react-google-maps';
import DriversType from '@/components/DriversType';
import SearchCity from '@/components/SearchCity';

const THIRTY_MINUTES = 30 * 60 * 1000; // 30 минут в миллисекундах

export default function Home() {
	const db = getDatabase();
	const starCountRef = ref(db, 'Drivers');
	const [currentDriversType, setCurrentDriversType] = useState<ButtonDriversType>('man');
	const [driversData, setDriversData] = useState<IDriversData[]| null>(null);

	useEffect(() => {
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			const dataArr = Object.values(data);

			//console.log(dataArr);
			//сортировкка по доступности
			const sortedItem = dataArr.filter((item: any) => item.state !== "" && item.timestamp) as IDriversData[];

			//console.log(sortedItem)
			//сортировка по времени
			const sortedByTime = sortedItem.map((item: any) => {
    		const currentTime = Date.now(); // Текущее время в миллисекундах
    		const elapsedTime = currentTime - item.timestamp; // Разница во времени
   			if(elapsedTime >= THIRTY_MINUTES) return item;
			});

			//console.log(sortedByTime);
			//сортировка по типу
			const sortedByType = sortedByTime.filter((item: any) => item !== undefined && item.carCurrent === currentDriversType) as IDriversData[];
			//console.log(sortedByType);
			if(sortedByType) setDriversData(sortedByType);
		});
	}, [currentDriversType]);


	const currentDataValue = ():string => {
		switch (currentDriversType) {
			case 'man':
				return 'Манипулятор';
			case 'bort':
				return 'Бортовой грузовик';
			case 'clos':
				return 'Закрытый грузовик';
			default:
				return 'Манипулятор';
		}
	}

  return (
		<APIProvider apiKey={`${process.env.googleMapApiKey}`}>
			
			<div className='h-screen grid grid-rows-12 grid-cols-12'>

				<header className='row-span-1 col-span-full flex items-center justify-between px-10 bg-gradient-to-r from-dark-red to-light-red'>

					<div className='flex items-center gap-x-2'>
						<Image src="/logo.png" width={60} height={60} alt="logo" />
						<h1 className='text-white font-extrabold text-2xl relative top-1'>ATK поиск</h1>
					</div>

					<SearchCity />
				
					<div className='text-white font-extrabold text-xl uppercase'>
						{currentDataValue()}
					</div>

					<SearchPhone setData={setDriversData} currentRef={starCountRef} currentType={currentDriversType} />

				</header>
				
				<DriversType set={setCurrentDriversType} currentType={currentDriversType}/>

				<Map data={driversData} type={currentDriversType}/>

			</div>

		</APIProvider>
  )
}