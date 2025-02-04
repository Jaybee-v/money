import * as bcrypt from "bcryptjs";

export const hash = (value: string, saltRounds: number) => {
  return bcrypt.hash(value, saltRounds);
};

export const compare = (value: string, hashedValue: string) => {
  return bcrypt.compare(value, hashedValue);
};
