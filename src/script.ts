let routes: any = {};
let templates: any = {};

let app_div = document.getElementById("app");

function home() {
	const div = document.createElement("div");
	div.innerHTML = "<h1>Hello World!</h1>";

	app_div.appendChild(div);
}

function route(path: any, template: any): any {
	if (typeof template === "function") {
		routes[path] = template;
	} else if (typeof template === "string") {
		routes[path] = templates[template];
	}
}

function template(name: any, templateFunction: any): any {
	templates[name] = templateFunction;
}

function resolveRoute(route: any): any {
	try {
		return routes[route];
	} catch (e) {
		throw new Error(`Route ${route} not found`);
	}
}

function router(event: any): any {
	const url = window.location.hash.slice(1) || "/";
	const route = resolveRoute(url);

	route();
}

route(routes, templates);

template("home", () => home());

route("/", "home");

window.addEventListener("load", router);
window.addEventListener("hashchange", router);
