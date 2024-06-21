"use client"
import { useState, useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import { ButtonDriversType } from '@/types/drivers';
import { IoClose, IoReorderThreeOutline } from "react-icons/io5";
import { getDatabase, ref, child, get } from "firebase/database";

function DriversType(
	{set, currentType, setLoading}: 
	{set:Function, currentType:ButtonDriversType, setLoading:Function}) {
	const dbRef = ref(getDatabase());
	const map = useMap();
	const boxRef = useRef<HTMLDivElement>(null);
	const [type, setType] = useState<ButtonDriversType>(currentType);
	const [telegram, setTelegram] = useState<string>('');
	const [isOpen, setIsOpen] = useState<boolean>(true);

	useEffect(() => {
		get(child(dbRef, 'Support'))
		.then((snapshot) => {
			const data = snapshot.val();
			setTelegram(data.orderTelegram);
		}).catch((error) => {
			console.error(error);
		});
	}, []);

	const setCurrentType = (type:ButtonDriversType):void => {
		if(!map) return;

		set(type);
		setType(type);
		map.setZoom(8);
		setLoading(true)
		setTimeout(() => {
			setLoading(false);
			map.setZoom(12);
		}, 800);
	}

	const handleClick = ():void => {
		if(boxRef.current) {
			boxRef.current.classList.toggle('-translate-x-full');
			setIsOpen(!isOpen);
		}
	}	
	
	return ( 
		<>
		<div className='flex flex-col absolute top-0 left-0 w-[280px] sm:w-[360px] h-full z-20 transition-transform duration-300' ref={boxRef}>

			<div className='h-24 flex items-center justify-center bg-gradient-to-r from-dark-red to-light-red'>
				<h1 className='text-2xl text-white'>Выберите т/c</h1>
			</div>

			<div className='flex-1 flex flex-col items-center justify-center gap-y-10 bg-hero-pattern bg-cover'>
				<button 
					className={`btn ${type === 'man' ? 'active' : ''}`} 
					onClick={() => {setCurrentType('man'); handleClick()}}>
					Манипулятор
				</button>
				<button 
					className={`btn ${type === 'bort' ? 'active' : ''}`} 
					onClick={() => {setCurrentType('bort'); handleClick()}}>
					Бортовой грузовик
				</button>
				<button 
					className={`btn ${type === 'clos' ? 'active' : ''}`} 
					onClick={() => {setCurrentType('clos'); handleClick()}}>
					Закрытый грузовик
				</button>
			</div>

			<div className='mt-auto h-24 flex items-center justify-center bg-gradient-to-r from-dark-red to-light-red'>
				<a href={telegram} target="_blank" className="btn">оставить заявку</a>
			</div>
			{isOpen 
				?
				<div 
					className='flex items-center justify-center w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] rounded-full bg-black 
					absolute top-1 -right-12 sm:-right-14 cursor-pointer' 
					onClick={handleClick}>
					<IoClose className='text-3xl sm:text-5xl text-white'/>	
				</div>
				:
				<div 
					className='flex items-center justify-center w-[40px] sm:w-[50px] h-[40px] sm:h-[50px] rounded-xl bg-black 
					absolute top-1 -right-12 sm:-right-14 cursor-pointer' 
					onClick={handleClick}>
					<IoReorderThreeOutline className='text-3xl sm:text-5xl text-white' />
				</div>
			}
		</div>
		{isOpen && <div className='fixed sm:hidden inset-0 bg-white/80 flex justify-center items-center z-10'></div>}
		</>
	);
}

export default DriversType;