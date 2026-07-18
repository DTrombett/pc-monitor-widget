import { freemem, totalmem } from "node:os";

export default () => ({
	free: freemem(),
	total: totalmem(),
});
