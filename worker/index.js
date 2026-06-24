const HotelSearch = {
  API_KEY: 'your_serpapi_key',
  PROXY: 'https://my-proxy.YOUR-NAME.workers.dev/?url=',

  async get(targetUrl) {
    const res = await fetch(
      `${this.PROXY}${encodeURIComponent(targetUrl)}`
    );
    if (!res.ok) throw new Error(`Error: ${res.status}`);
    return res.json();
  }
};
