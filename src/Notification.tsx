import { toast } from 'react-toastify';

export function Notification(message: string) {
  return toast.success(message, {
    position: 'top-right',
    autoClose: 3000, // Time in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}

export function Alert(message: string) {
  return toast.error(message, {
    position: 'top-right',
    autoClose: 3000, // Time in milliseconds
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
  });
}