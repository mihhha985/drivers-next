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

export default function Home() {
	const db = getDatabase();
	const starCountRef = ref(db, 'Drivers');
	const [currentDriversType, setCurrentDriversType] = useState<ButtonDriversType>('man');
	const [driversData, setDriversData] = useState<IDriversData[]| null>(null);

	useEffect(() => {
		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			const dataArr = Object.values(data);
			console.log(dataArr);
			const sortedItem = dataArr.filter((item: any) => item.carCurrent === currentDriversType) as IDriversData[];
			if(sortedItem) setDriversData(sortedItem);
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
						<h1 className='text-white font-extrabold text-2xl relative top-1'>ATK Поиск</h1>
					</div>

					<SearchCity />
				
					<div className='text-white font-extrabold text-xl uppercase'>
						{currentDataValue()}
					</div>

					<SearchPhone setData={setDriversData} currentRef={starCountRef} currentType={currentDriversType} />

				</header>
				
				<DriversType set={setCurrentDriversType} currentType={currentDriversType}/>

				<Map data={driversData} />

			</div>

		</APIProvider>
  )
}