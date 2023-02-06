import { HeadersDefaults } from "axios";

type keyTiming = {
  timestamp: number;
  key: string;
};

type User = {
  username?: string;
  email?: string;
  created?: string;
  races_completed?: number | string;
  average_speed?: number | string;
  races_won?: number | string;
};

interface HeaderProperties extends HeadersDefaults {
  Authorization: string;
}

type keys = {
  [key: string]: number;
};

export { keyTiming, keys, User, HeaderProperties };
