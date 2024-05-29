export interface IDriversData {
	also: string;
	carCurrent: ButtonDriversType;
	carType: string;
	lat: number;
	lon: number;
	name: string;
	password: string;
	phone: string;
	seticon:string;
	state: string;
	status: string;
	timestamp: string;
	weight: number;
}

export type ButtonDriversType = 'man' | 'bort' | 'clos';
