import React from 'react';
import { useToast } from './use-toast';

export function Toaster() {
	const { toasts = [] } = useToast();

	return (
		<div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
			{toasts &&
				toasts.length > 0 &&
				toasts.map((toast) => (
					<div
						key={toast.id}
						className="group pointer-events-auto relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-md border p-6 pr-8 shadow-lg transition-all"
					>
						<div className="grid gap-1">
							{toast.title && (
								<div className="text-sm font-semibold">{toast.title}</div>
							)}
							{toast.description && (
								<div className="text-sm opacity-90">{toast.description}</div>
							)}
						</div>
					</div>
				))}
		</div>
	);
}