import { Ride } from "@/types/type";

export const sortRides = (rides: Ride[]): Ride[] => {
  const result = rides
  // const result = rides.sort((a, b) => {
  //   const dateA = new Date(`${a.created_at}T${a.ride_time}`);
  //   const dateB = new Date(`${b.created_at}T${b.ride_time}`);
  //   return dateB.getTime() - dateA.getTime();
  // });

  return result.reverse();
};

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? 'PM' : 'AM';

  const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
  const formattedMinutes = minutes.toString().padStart(2, '0');

  return `${day} ${month} ${year}, ${formattedHours}:${formattedMinutes} ${ampm}`;
}
