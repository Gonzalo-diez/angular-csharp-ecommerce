import { AuthRole } from "./auth.role";

export interface AuthModel {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: AuthRole;
    products?: null;
    purchases: null; 
}
