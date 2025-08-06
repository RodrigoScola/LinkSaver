import { createContext, useContext, useEffect, useMemo } from 'react';

import { useToast } from '@chakra-ui/react';
import { useObject } from './useObject';

type Notification = {
	id: string;
	title: string;
	duration: number;
	description: string;
	status: 'success' | 'error' | 'info';
	isClosable: boolean;
	createdAt?: Date;
};

export function newNotification(opts: Partial<Notification>): Notification {
	return {
		id: opts.id ?? Date.now().toString(),
		title: opts.title || '',
		duration: opts.duration || 5000,
		description: opts.description || '',
		status: opts.status || 'success',
		isClosable: opts.isClosable ?? true,
		createdAt: opts.createdAt || new Date(),
	};
}

type NotificationContextType = {
	notifications: Notification[];
	add: (options: Partial<Notification>) => void;
	remove: (id: string) => void;
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
	const toast = useToast();

	const notifications = useObject<Record<number, Notification>>();

	useEffect(() => {
		try {
			const latest = Object.values(notifications.value)[Object.keys(notifications.value).length - 1];

			if (latest.id) {
				if (!toast.isActive(latest.id)) {
					toast({ position: 'top', ...latest });
				}
			}
			setTimeout(() => {
				toast.close(latest.id);
				remove(latest.id);
			}, latest.duration);
		} catch (err) {}
	}, [notifications.value]);

	const add = (options: Partial<Notification>) => {
		const notification = newNotification(options);
		notifications.update({ [notification.id]: notification });
		toast({
			position: 'top',
			...notification,
		});
	};

	const remove = (id: string) => {
		const withoutId = Object.entries(notifications.value).reduce(
			(acc: Record<number, Notification>, [key, value]) => {
				if (value.id !== id) {
					acc[Number(key)] = value;
				}

				return acc;
			},
			{}
		);

		notifications.update(withoutId);
	};

	const notificationsValue = useMemo(() => Object.values(notifications.value), [notifications.value]);
	return (
		<NotificationContext.Provider
			value={{
				notifications: notificationsValue,
				add,
				remove,
			}}>
			{children}
		</NotificationContext.Provider>
	);
};

export const useNotifications = () => {
	const ctx = useContext(NotificationContext);

	if (!ctx) {
		throw new Error('useNotifications must be used within a NotificationProvider');
	}

	return ctx;
};
