import { User } from "@application/services/User.ts";

export interface UserRecord {
  id: string;
  user: User;
  createdAt: string;
}

export interface UserApiRecord {
  id: string;
  name: string;
  username: string;
  email: string;
  address: {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: { lat: string; lng: string };
  };
  phone: string;
  website: string;
  company: { name: string; catchPhrase: string; bs: string };
}
