//
//
//
//
// Переменные

export const body = document.querySelector("body");
export const html = document.querySelector("html");

export const modals = document.querySelectorAll(".modal");
export const modalStack = [];

export const headerTop = document.querySelector(".header");
export const headerTopFixed = "header_fixed";
export let fixedHeader = true;

export const fixedElements = document.querySelectorAll("[data-fixed]");
export const stickyObservers = new Map();

export const allForms = document.querySelectorAll("form");

export const menu = document.querySelector(".header__mobile");
export const burgerButton = document.querySelector(".burger");
export const menuActive = "active";

export const burgerMedia = 991;
export const bodyOpenModalClass = "modal-show";

export let windowWidth = window.innerWidth;
export let containerWidth = document.querySelector(".container")?.offsetWidth || 0;

export const checkWindowWidth = () => {
  windowWidth = window.innerWidth;
  containerWidth = document.querySelector(".container")?.offsetWidth || 0;
};
