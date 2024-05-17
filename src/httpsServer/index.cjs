/**
 * 使用async await封装fetch
 **/

class EasyHttp {
  //get
  async get(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }

  //POST
  async post(url, datas) {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(datas),
    });
    const data = await response.json();
    return data;
  }
}
export default new EasyHttp();
