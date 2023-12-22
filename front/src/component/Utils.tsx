/**
 * Set user data in local storage.
 * @param user An object containing user data.
 */
 export const setUserDataInLocalStorage = (user: any) => {
    localStorage.setItem("bankUserIsLogged", String(user.isLogged));
    localStorage.setItem("bankUserIsConfirmed", String(user.isConfirmed));
    localStorage.setItem("bankUserToken", user.token || "");
    localStorage.setItem("bankUserEmail", user.email || "");
  };
  
  /**
   * Get user data from local storage.
   * @returns An object with user data retrieved from local storage.
   */
  export const getUserDataFromLocalStorage = () => {
    return {
      isLogged: localStorage.getItem("bankUserIsLogged") === "true" || false,
      isConfirmed:
        localStorage.getItem("bankUserIsConfirmed") === "true" || false,
      token: localStorage.getItem("bankUserToken") || null,
      email: localStorage.getItem("bankUserEmail") || null,
    };
  };
  
  export const validateEmail = (email: string): boolean => {
    const emailRegex: RegExp = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };
  
  export const validatePassword = (password: string) => {
    // Define your password validation criteria here
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*]/.test(password);
  
    return password.length >= minLength && hasUppercase && hasSpecialChar;
  };
  
  export const validateMoneyAmount = (input: string): boolean => {
    // Regular expression to match a valid money amount
    const moneyRegex = /^\$?[0-9]+(\.\d{1,2})?$/;
    return moneyRegex.test(input);
  };
  
  class AmountSplitter {
    static splitAmount(amount: number) {
      const dollars = Math.floor(amount);
      const cents = (amount - dollars) * 100;
      return { dollars, cents };
    }
  }
  
  export function formatTimestamp(timestamp: string) {
    const date = new Date(timestamp);
    const now = new Date();
  
    if (date.toDateString() === now.toDateString()) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${hours}:${minutes}`;
    } else {
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      const formattedDate = `${months[date.getMonth()]} ${date.getDate()}`;
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      return `${formattedDate} ${hours}:${minutes}`;
    }
  }
  
  export function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const timeDifference = now.getTime() - new Date(timestamp).getTime();
  
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const hours = Math.floor(minutes / 60);
  
    if (minutes < 1) {
      return "just now";
    } else if (minutes === 1) {
      return "1 min. ago";
    } else if (minutes < 60) {
      return `${minutes} min. ago`;
    } else if (hours === 1) {
      return "1 hour ago";
    } else {
      return `${hours} hours ago`;
    }
  }
  
  export const formatDate = (timestamp: string): string => {
    const date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(date);
    return formattedDate;
  };
  
  export default {
    setUserDataInLocalStorage,
    getUserDataFromLocalStorage,
    validateEmail,
    validatePassword,
    validateMoneyAmount,
    AmountSplitter,
    formatTimestamp,
    formatTimeAgo,
    formatDate,
    // Add more utility functions here if needed
  };

  // export const setUserDataInLocalStorage = (user: any) => {
  //   localStorage.setItem("bankUserIsLogged", String(user.isLogged));
  //   localStorage.setItem("bankUserIsConfirmed", String(user.isConfirmed));
  //   localStorage.setItem("bankUserToken", user.token || "");
  //   localStorage.setItem("bankUserEmail", user.email || "");
  // };