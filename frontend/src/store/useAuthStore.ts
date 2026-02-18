import { create } from 'zustand';

type UserType = 'employee' | 'admin' | null;

interface AuthState {
    userType: UserType;
    employeeId: string | null;
    setUserType: (type: UserType) => void;
    setEmployeeId: (id: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    userType: null,
    employeeId: null,
    setUserType: (type: UserType) => set({ userType: type }),
    setEmployeeId: (id: string) => set({ employeeId: id }),
    logout: () => set({ userType: null, employeeId: null }),
}));
