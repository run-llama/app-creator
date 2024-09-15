const fetcher = (url, options) => fetch(url, options).then((res) => res.json());

export default fetcher;
