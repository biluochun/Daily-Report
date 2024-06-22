import { AtomEffect, atom } from 'recoil';

export const localStorageEffect = <T>(key: string) => {
  const fun: AtomEffect<T> = ({ setSelf, onSet }) => {
    const savedValue = localStorage.getItem(key);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue));
    });
  };
  return fun;
};

export const fetchJson = async (url: string) => {
  const res = await fetch(url, { method: 'GET' }).then((res) => res.json());
  return res;
};
