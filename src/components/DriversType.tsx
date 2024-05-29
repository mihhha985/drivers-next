"use client"
import { useState } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { ButtonDriversType } from '@/types/drivers';

function DriversType({set, currentType}: {set:Function, currentType:ButtonDriversType}) {
	const map = useMap();
	const [type, setType] = useState<ButtonDriversType>(currentType);

	const setCurrentType = (type:ButtonDriversType):void => {
		if(!map) return;

		set(type);
		setType(type);
		map.setZoom(8);
	}
	
	return ( 
		<div className='flex flex-col h-full row-span-11 col-span-3'>

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
				<a href="https://t.me/ATKpoiskzakazy" target="_blank" className="btn">Заказать грузовик</a>
			</div>

		</div>
	);
}

export default DriversType;