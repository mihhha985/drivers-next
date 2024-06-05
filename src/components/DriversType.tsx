"use client"
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useMap } from '@vis.gl/react-google-maps';
import { ButtonDriversType } from '@/types/drivers';
import { getDatabase, ref, child, get } from "firebase/database";

function DriversType({set, currentType}: {set:Function, currentType:ButtonDriversType}) {
	const dbRef = ref(getDatabase());
	const map = useMap();
	const [type, setType] = useState<ButtonDriversType>(currentType);
	const [telegram, setTelegram] = useState<string>('');
	const [baner, setBaner] = useState<string>('');
	const [link, setLink] = useState<string>('');
	const [close, setClose] = useState<boolean>(false);

	useEffect(() => {
		get(child(dbRef, 'Support'))
		.then((snapshot) => {
			const data = snapshot.val();
			setTelegram(data.orderTelegram);
		}).catch((error) => {
			console.error(error);
		});
	}, []);

	useEffect(() => {
		get(child(dbRef, 'Products/banner'))
		.then((snapshot) => {
			const data = snapshot.val();
			setBaner(data.image);
			setLink(data.link);
		}).catch((error) => {
			console.error(error);
		});

		const timer = setTimeout(() => {
			setClose(true);
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	const setCurrentType = (type:ButtonDriversType):void => {
		if(!map) return;

		set(type);
		setType(type);
		map.setZoom(12);
	}

	const handleClose = ():void => {
		if(!close) return;

		setBaner('');
	}
	
	return ( 
		<div className='flex flex-col h-full row-span-11 col-span-3 relative'>

			<div className='flex-1 flex flex-col items-center justify-center gap-y-10 bg-hero-pattern bg-cover'>
				<button 
					className={`btn ${type === 'man' ? 'active' : ''}`} 
					onClick={() => setCurrentType('man')}>
					Манипулятор
				</button>
				<button 
					className={`btn ${type === 'bort' ? 'active' : ''}`} 
					onClick={() => setCurrentType('bort')}>
					Бортовой грузовик
				</button>
				<button 
					className={`btn ${type === 'clos' ? 'active' : ''}`} 
					onClick={() => setCurrentType('clos')}>
					Закрытый грузовик
				</button>
			</div>

			<div className='mt-auto h-24 flex items-center justify-center bg-gradient-to-r from-dark-red to-light-red'>
				<a href={telegram} target="_blank" className="btn">оставить заявку</a>
			</div>
			{baner &&
				<div className='absolute inset-1 flex flex-col items-center justify-end gap-y-10 pb-20'>
					<Image src={baner} alt='baner' sizes='100%' className='object-cover z-10' fill/>
					<a className="btn relative z-20" href={link}>перейти</a>
					<button className="btn relative z-20" onClick={handleClose}>закрыть</button>
				</div>	
			}
		</div>
	);
}

export default DriversType;