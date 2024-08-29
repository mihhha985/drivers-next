"use client"
import Image from 'next/image';
import Map from '@/components/Map';
import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import { ButtonDriversType,	IDriversData } from '@/types/drivers';
import SearchPhone from '@/components/SearchPhone';
import { APIProvider } from '@vis.gl/react-google-maps';
import DriversType from '@/components/DriversType';
import SearchCity from '@/components/SearchCity';
import Banner from '@/components/Banner';

const THIRTY_MINUTES = 30 * 60; // 30 минут в секундах

export default function Home() {
	const db = getDatabase();
	const starCountRef = ref(db, 'Drivers');
	const [currentDriversType, setCurrentDriversType] = useState<ButtonDriversType>('man');
	const [driversData, setDriversData] = useState<IDriversData[]| null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(false);

	useEffect(() => {
		const dbRef = ref(getDatabase());

		onValue(starCountRef, (snapshot) => {
			const data = snapshot.val();
			const dataArr = Object.values(data) as IDriversData[];
			//console.log(dataArr);
			//сортировкка по доступности
			const sortedItem = dataArr.filter((item: any) => item.state !== "") as IDriversData[];

			//console.log(sortedItem);
			let sortedByTime = sortedItem;
			//сортировка по времени
			get(child(dbRef, 'preference'))
			.then((snapshot) => {
				if(snapshot.exists()) {
					const data = snapshot.val();
					let sortedByTime = sortedItem;
					if(data.onClearMap) {
						sortedByTime = sortedItem.map((item: any) => {
							const currentTime = Math.round(Date.now() / 1000);
							const elapsedTime = currentTime - item.timestamp;
							//console.log(elapsedTime);
							if(elapsedTime <= THIRTY_MINUTES) return item;
						});
					}

					return sortedByTime;
				}
			})
			.then(data => {
				if(data !== undefined) {
					const sortedByType = data.filter((item: any) => item !== undefined && item.carCurrent === currentDriversType) as IDriversData[];
					if(sortedByType) setDriversData(sortedByType);
				}
			})
			.catch((error) => {
				console.error(error);
			});
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
			
			<div className='h-screen flex flex-col'>

				<header className='hidden sm:grid grid-cols-2 lg:flex items-center justify-between gap-1 px-5 xl:px-10 py-2 bg-gradient-to-r from-dark-red to-light-red'>

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

				<div className='relative flex flex-col w-full h-full overflow-hidden'>

					<div className='flex flex-col items-center w-full p-2 bg-gradient-to-r from-dark-red to-light-red sm:hidden'>
						<SearchCity />
						<h4 className='text-2xl text-white'>{currentDataValue()}</h4>
					</div>

					{isLoading 
						?
						<div className='w-full h-full bg-slate-200'></div>
						:
						<Map data={driversData} type={currentDriversType}/>
					}

					<div className='flex flex-col items-center w-full p-2 bg-gradient-to-r from-dark-red to-light-red sm:hidden'>
						<SearchPhone setData={setDriversData} currentRef={starCountRef} currentType={currentDriversType} />
					</div>

					<DriversType 
						set={setCurrentDriversType} 
						setLoading={setIsLoading}
						currentType={currentDriversType}
					/>

				</div>

			</div>

			<Banner />

		</APIProvider>
  )
}