import { useState, useEffect } from 'react';
import { ImSpinner8 } from "react-icons/im";
import Image from 'next/image';
import { getDatabase, ref, child, get } from "firebase/database";

const Banner = () => {
	const dbRef = ref(getDatabase());
	const [baner, setBaner] = useState<string>('');
	const [link, setLink] = useState<string>('');
	const [showBanner, setShowBanner] = useState<boolean>(false);
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
			if(data.showBanner && data.showLinkButton) setShowBanner(true);
		})
		.catch((error) => {
			console.error(error);
		});

		setTimeout(() => {
			setClose(false);
		}, 10000);

	}, []);

	if(!showBanner) return null;

	return (
		<div className='fixed inset-0 bg-black/80 flex justify-center items-center z-50'>
			<div className='relative h-[90%] w-[360px] sm:w-[480px] flex flex-col items-center justify-end gap-y-4 sm:gap-y-8 pb-5 sm:pb-10'>
				<Image src={baner} alt='baner' sizes='100%' className=' object-fill sm:object-contain z-10' fill/>
				<a className="btn relative z-20" href={link}>перейти</a>
				<div className='overflow-hidden relative z-20'>
					<button className="btn" onClick={() => setShowBanner(false)}>закрыть</button>
					{close && <div className='absolute inset-0 btn z-10 flex items-center justify-center'>
						<ImSpinner8 className='text-white text-2xl animate-spin'/>
					</div>}
				</div>
			</div>
		</div>
	);
};

export default Banner;