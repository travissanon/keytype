const pipe = (...fns: any[]) => (x: any) =>
	[...fns].reduce((acc, f) => f(acc), x);

export default pipe;
