/** @type {import('next').NextConfig} */
const nextConfig = {
	env: {
		googleMapApiKey: 'AIzaSyAvOyTBrSkFy0e4Tjn3WGGxEtuvoy6oZRA',
		googleMapId: '7aeb05971bbb88a3',
	},
	images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
      },
    ],
	},
};

export default nextConfig;
