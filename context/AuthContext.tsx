import React, { createContext, useState, useContext, ReactNode } from 'react';

import { Booking, User } from '../types/BookingTypes';

interface AuthState {
  isLoggedIn: boolean;
  loggedInUser: User;
  bookings: Booking[];
}

interface AuthContextProps {
  authState: AuthState;
  login: (user: User) => void;
  logout: () => void;
  addBooking: (booking: Booking) => void;
}

const defaultAuthState: AuthState = {
  isLoggedIn: false,
  loggedInUser: null,
  bookings: []
};

export const AuthContext = createContext<AuthContextProps>({
  authState: defaultAuthState,
  login: () => {},
  logout: () => {},
  addBooking: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState(defaultAuthState);
  
  const login = (user: User) => {
    setAuthState(currentState => ({ ...currentState, isLoggedIn: true, loggedInUser: user, bookings: [] }));
    /*
    setAuthState(currentState => {
      console.log("current state:", currentState);
      console.log("state user:", user);

      return { ...currentState, isLoggedIn: true, loggedInUser: user, bookings: [] };
    });
    */
  };

  const logout = () => {
    setAuthState(currentState => { return { ...currentState, isLoggedIn: false, loggedInUser: null, bookings: [] }; });
  };

  const addBooking = (booking: Booking) => {
    setAuthState(currentState => { return { ...currentState, bookings: [...currentState.bookings, booking] }; });
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, addBooking }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
    return useContext(AuthContext);
  }
