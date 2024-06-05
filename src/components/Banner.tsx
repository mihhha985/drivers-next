import { useState, useEffect } from 'react';
import Image from 'next/image';
import { getDatabase, ref, child, get } from "firebase/database";

const Banner = () => {
	const dbRef = ref(getDatabase());
	const [baner, setBaner] = useState<string>('');
	const [link, setLink] = useState<string>('');
	const [close, setClose] = useState<boolean>(true);

	useEffect(() => {
		get(child(dbRef, 'Products/banner'))
		.then((snapshot) => {
			const data = snapshot.val();
			setBaner(data.image);
			setLink(data.link);
		}).catch((error) => {
			console.error(error);
		});
	}, []);

	useEffect(() => {
		get(child(dbRef, 'checkbox'))
		.then((snapshot) => {
			const data = snapshot.val();
			if(data.showBanner && data.showLinkButton) setClose(false);
		}).catch((error) => {
			console.error(error);
		});
	}, []);

	if(close) return null;

	return (
		<div className='fixed inset-0 bg-black opacity-80 flex justify-center items-center z-50'>
			<div className='relative h-[60vh] flex flex-col items-center justify-end gap-y-10 pb-20 px-10'>
				<Image src={baner} alt='baner' sizes='100%' className='object-cover z-10' fill/>
				<a className="btn relative z-20" href={link}>перейти</a>
				<button className="btn relative z-20" onClick={() => setClose(true)}>закрыть</button>
			</div>
		</div>
	);
};

export default Banner;