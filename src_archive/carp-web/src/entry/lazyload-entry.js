import LazyLoad from "vanilla-lazyload";

const logEvent = (eventName, element) => {
	console.log(
		Date.now(),
		eventName,
		element.getAttribute("data-src"),
		element.getAttribute("src")
	);
};

const lazyLoadOptions = {
	elements_selector: ".lazy",
	to_webp: true,

	callback_enter: element => {
		logEvent("ENTERED", element);
	},
	callback_load: element => {
		logEvent("LOADED", element);
	},
	callback_set: element => {
		logEvent("SET", element);
	},
	callback_error: element => {
		logEvent("ERROR", element);
		element.src = "https://placehold.co/400x300?text=Placeholder&font=roboto";
	}
};

const createLazyLoadInstance = () => {
	return new LazyLoad(lazyLoadOptions);
};

// export default () => {
// 	document.addEventListener("DOMContentLoaded", createLazyLoadInstance);
// };

// Optional: Attach to globalThis if needed
globalThis.LazyLoad = LazyLoad;


// Only import LazyLoad class will result in empty file.
// Why: Doesn’t automatically attach anything globally unless you do so explicitly.
// Auto-init if you want to export a working bundle
document.addEventListener("DOMContentLoaded", createLazyLoadInstance);