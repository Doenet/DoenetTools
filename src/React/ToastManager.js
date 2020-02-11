import React, { useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const ToastContext = React.createContext();

// Styled Components
// ==============================

const ToastContainer = (props) => (
	<div
		style={{
			position: 'absolute',
			right: 20,
			top: 60,
			zIndex: 10
		}}
		{...props}
	/>
);

const Toast = ({ children, remove }) => {
	const removeRef = useRef();
	removeRef.current = remove;

	useEffect(() => {
		const duration = 5000;
		const id = setTimeout(() => removeRef.current(), duration);

		return () => clearTimeout(id);
	}, []);

	return (
		<div
			style={{
				border: '2px solid transparent',
				backgroundColor: '#fafafa',
				borderRadius: '4px',
				boxShadow: '0px 0px 5px rgba(0, 0, 0, .2)',
				marginTop: '16px',
				display: 'flex',
				position: 'relative',
				cursor: 'pointer'
			}}
		>
			<div style={{ padding: '12px 24px', lineHeight: '1.4' }}>{children}</div>
			<div>
				<button
					onClick={remove}
					style={{
						border: 'none',
						backgroundColor: 'transparent',
						fontSize: '16px',
						marginTop: '8px',
						marginRight: '8px',
						cursor: 'pointer'
					}}
				>
					<FontAwesomeIcon icon={faTimes} style={{ position: 'absolute', top: 15, right: 10, color: '#878787' }} />
				</button>
			</div>
		</div>
	);
};

// Provider
// ==============================

let toastCount = 0;

export function ToastProvider({ children }) {
	const [ toasts, setToasts ] = React.useState([]);

	const add = (content) => {
		const id = toastCount++;
		const toast = { content, id };
		setToasts([ ...toasts, toast ]);
	};
	const remove = (id) => {
		const newToasts = toasts.filter((t) => t.id !== id);
		setToasts(newToasts);
	};

	console.log(toasts);

	return (
		<ToastContext.Provider value={{ add, remove }}>
			{children}
			<ToastContainer>
				{toasts.map(({ content, id, ...rest }) => (
					<Toast key={id} Toast={Toast} remove={() => remove(id)} {...rest}>
						{content}
					</Toast>
				))}
			</ToastContainer>
		</ToastContext.Provider>
	);
}

// Consumer
// ==============================

export const useToasts = () => React.useContext(ToastContext);
