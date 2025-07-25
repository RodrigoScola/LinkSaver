export function IsInEnum<T extends string | number>(
	item: T,
	enumType: Record<string, T>
): item is (typeof enumType)[keyof typeof enumType] {
	return Object.values(enumType).includes(item);
}
export function isKeyof<T extends object>(key: any, obj: T): key is keyof T {
	return key in obj;
}
